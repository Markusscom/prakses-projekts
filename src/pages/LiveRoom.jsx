import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function LiveRoom() {
    const { code } = useParams();
    const [room, setRoom] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        loadRoom();
        loadPlayers();

        const interval = setInterval(() => {
            loadPlayers();
            loadRoom();
        }, 2000);

        return () => clearInterval(interval);
    }, [code]);

    async function loadRoom() {
        const { data } = await supabase
            .from("rooms")
            .select("*")
            .eq("code", code)
            .single();

        setRoom(data);
    }

    async function loadPlayers() {
        const { data } = await supabase
            .from("players")
            .select("*")
            .eq("room_code", code);

        setPlayers(data || []);
    }

    if (!room) {
        return <h2>Loading room...</h2>;
    }

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Room: {code}</h1>

            <h2>Status: {room.status}</h2>

            <h3>
                Players ({players.length})
            </h3>

            <ul>
                {players
                    .filter(
                        (p) =>
                            p.status !== "kicked"
                    )
                    .map((p) => (
                        <li key={p.id}>
                            {p.nickname}
                        </li>
                    ))}
            </ul>

            {room.status === "waiting" && (
                <h2>
                    Waiting for teacher to start...
                </h2>
            )}

            {room.status === "playing" && (
                <h2>Game started!</h2>
            )}
        </div>
    );
}