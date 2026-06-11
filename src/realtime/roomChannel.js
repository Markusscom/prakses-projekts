import { supabase } from "../lib/supabase";

const supabase = getSupabase();

export function subscribeRoom(code, onRoom, onPlayers) {
  const channel = supabase
    .channel("room-" + code)

    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "rooms",
      filter: `code=eq.${code}`
    }, (payload) => {
      onRoom(payload.new);
    })

    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "players",
      filter: `room_code=eq.${code}`
    }, () => {
      onPlayers();
    })

    .subscribe();

  return channel;
}