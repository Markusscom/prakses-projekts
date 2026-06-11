import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSupabase } from "../lib/supabase";
import { subscribeRoom } from "../realtime/roomChannel";

const supabase = getSupabase();

export default function LiveRoom() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);

  const nickname = localStorage.getItem("nickname");

  useEffect(() => {
    load();

    const channel = subscribeRoom(
      code,
      (updatedRoom) => {
        setRoom(updatedRoom);
      },
      () => {
        loadPlayers();
      }
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [code]);

  useEffect(() => {
    if (!room) return;

    if (room.status === "playing") {
      navigate(`/play/${code}`);
    }
  }, [room, code, navigate]);

  useEffect(() => {
    if (!nickname) return;

    const me = players.find(
      (p) => p.nickname === nickname
    );

    if (me?.status === "kicked") {
      localStorage.removeItem("roomCode");
      navigate("/join");
    }
  }, [players, nickname, navigate]);

  async function load() {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", code)
      .single();

    if (!data) {
      navigate("/join");
      return;
    }

    setRoom(data);
    await loadPlayers();
  }

  async function loadPlayers() {
    const { data } = await supabase
      .from("players")
      .select("*")
      .eq("room_code", code);

    setPlayers(data || []);
  }

  if (!room) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>Room {code}</h1>

      <h2>Status: {room.status}</h2>

      {room.status === "waiting" && (
        <h3>Waiting for teacher to start...</h3>
      )}

      <h3>Players ({players.filter(p => p.status !== "kicked").length})</h3>

      {players
        .filter((p) => p.status !== "kicked")
        .map((player) => (
          <div key={player.id}>
            {player.nickname}
          </div>
        ))}
    </div>
  );
}