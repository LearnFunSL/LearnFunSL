"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

import type { SupabaseClient } from "@supabase/supabase-js";

interface RealtimeXpProps {
  initialTotalXp: number;
}

export function RealtimeXp({ initialTotalXp }: RealtimeXpProps) {
  const [totalXp, setTotalXp] = useState(initialTotalXp);
  const { getAuthenticatedClient } = useSupabase();
  const { user } = useUser();

  useEffect(() => {
    setTotalXp(initialTotalXp);
  }, [initialTotalXp]);

  const handleXpUpdate = useCallback((payload: any) => {
    const newXp = (payload.new as { xp_total: number }).xp_total;
    setTotalXp(newXp);
  }, []);

  useEffect(() => {
    if (!user) return;

    let client: SupabaseClient<any, "public", any> | undefined;
    const channelName = `user-xp-changes-${user.id}`;

    const setupSubscription = async () => {
      client = await getAuthenticatedClient();

      const channel = client
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "users",
            filter: `clerk_id=eq.${user.id}`,
          },
          handleXpUpdate,
        )
        .subscribe();

      return channel;
    };

    const subscriptionPromise = setupSubscription();

    return () => {
      subscriptionPromise.then((channel) => {
        if (client && channel) {
          client.removeChannel(channel);
        }
      });
    };
  }, [user, getAuthenticatedClient, handleXpUpdate]);

  return <>{totalXp}</>;
}
