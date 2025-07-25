"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupabaseClient } from "@supabase/supabase-js";

export function GamificationSummary() {
  const [totalXp, setTotalXp] = useState<number | null>(4325);
  const { getAuthenticatedClient } = useSupabase();
  const { user } = useUser();

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

      // Fetch initial XP
      const { data } = await client
        .from("users")
        .select("xp_total")
        .eq("clerk_id", user.id)
        .single();
      if (data) {
        setTotalXp(data.xp_total);
      }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-6xl font-bold text-primary">
            {totalXp === null ? "4325" : totalXp.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Keep up the great work!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
