import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { log } from "next-axiom";

let supabase: SupabaseClient;
let channel: RealtimeChannel | null = null;

/**
 * Initializes the real-time client if it hasn't been already.
 */
const initializeRealtime = () => {
  if (!supabase) {
    supabase = createClient();
  }
};

/**
 * Subscribes to real-time events on a specific table.
 * @param table The name of the table to subscribe to.
 * @param event The event type to listen for ('INSERT', 'UPDATE', 'DELETE', or '*').
 * @param callback The function to call when the event is received.
 * @returns The real-time channel.
 */
export const subscribeToTable = (
  table: string,
  event: "INSERT" | "UPDATE" | "DELETE" | "*",
  callback: (payload: any) => void,
): RealtimeChannel => {
  initializeRealtime();

  const channelId = `realtime:${table}`;
  channel = supabase.channel(channelId);

  (channel.on as any)(
    "postgres_changes",
    { event, schema: "public", table },
    callback,
  ).subscribe((status: any, err: any) => {
    if (status === "SUBSCRIBED") {
      log.info(`Subscribed to ${table} changes`);
    }
    if (status === "CHANNEL_ERROR" && err) {
      log.error("Real-time channel error", { error: err.message });
    }
  });

  return channel;
};

/**
 * Unsubscribes from a real-time channel.
 */
export const unsubscribeFromChannel = () => {
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
    log.info("Unsubscribed from real-time channel");
  }
};
