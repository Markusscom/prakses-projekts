import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function LiveRoom() {
    const { code } = useParams();
    const [room, setRoom] = useState(null);
    const [players, setPlayers] = useState([]);

    const nickname = localStorage.getItem("nickname");

    useEffect(() => {
        load();

        const interval = setInterval(() => {
            load();
            checkKick();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    async function load() {
        const { data: r } = await supabase
            .from("rooms")
            .select("*")
            .eq("code", code)
            .single();

        setRoom(r);

        const { data: p } = await supabase
            .from("players")
            .select("*")
            .eq("room_code", code);

        setPlayers(p || []);
    }

    async function checkKick() {
        const { data } = await supabase
            .from("players")
            .select("*")
            .eq("room_code", code)
            .eq("nickname", nickname)
            .single();

        if (data?.status === "kicked") {
            window.location.href = "/join";
        }
    }

    if (!room) return <h2>Loading...</h2>;

    return (
        <div>
            <h1>Room {code}</h1>

            <h3>Status: {room.status}</h3>

            {room.status === "waiting" && (
                <h2>Waiting for teacher...</h2>
            )}

            {room.status === "playing" && (
                <h2>Game started!</h2>
            )}

            <h3>Players</h3>

            {players
                .filter(p => p.status !== "kicked")
                .map(p => (
                    <div key={p.id}>{p.nickname}</div>
                ))}
        </div>
    );
}