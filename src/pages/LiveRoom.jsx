import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSupabase } from "../lib/supabase";

const supabase = getSupabase();
import { subscribeRoom } from "../realtime/roomChannel";

export default function LiveRoom() {
  const { code } = useParams();
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);

  const nickname = localStorage.getItem("nickname");

  useEffect(() => {
    load();

    const channel = subscribeRoom(
      code,
      setRoom,
      loadPlayers
    );

    return () => supabase.removeChannel(channel);
  }, [code]);

  async function load() {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", code)
      .single();

    setRoom(data);
    loadPlayers();
  }

  async function loadPlayers() {
    const { data } = await supabase
      .from("players")
      .select("*")
      .eq("room_code", code);

    setPlayers(data || []);
  }

  useEffect(() => {
    if (!room) return;
    if (players.find(p => p.nickname === nickname && p.status === "kicked")) {
      window.location.href = "/join";
    }
  }, [players]);

  if (!room) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>{code}</h1>
      <h2>{room.status}</h2>

      {room.status === "waiting" && <h3>Waiting...</h3>}
      {room.status === "playing" && <h3>Game started</h3>}

      <h3>Players</h3>

      {players
        .filter(p => p.status !== "kicked")
        .map(p => (
          <div key={p.id}>{p.nickname}</div>
        ))}
    </div>
  );
}