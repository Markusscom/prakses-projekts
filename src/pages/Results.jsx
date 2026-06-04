import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Results() {
    const { code } = useParams();
    const [players, setPlayers] = useState([]);
    const [room, setRoom] = useState(null);

    useEffect(() => {
        load();

        const interval = setInterval(() => {
            load();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    async function load() {
        const { data: roomData } = await supabase
            .from("rooms")
            .select("*")
            .eq("code", code)
            .single();

        setRoom(roomData);

        const { data: playersData } = await supabase
            .from("players")
            .select("*")
            .eq("room_code", code)
            .order("score", { ascending: false });

        setPlayers(playersData || []);
    }

    if (!room) return <h2>Loading...</h2>;

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Results</h1>

            <h2>Room {code}</h2>

            <h3>Winner</h3>

            {players.length > 0 && (
                <h2>
                    🏆 {players[0].nickname}
                </h2>
            )}

            <h3>Leaderboard</h3>

            <ol>
                {players.map((p) => (
                    <li key={p.id}>
                        {p.nickname} — {p.score} pts
                    </li>
                ))}
            </ol>

            {room.status !== "finished" && (
                <h4>
                    Game not marked as finished yet
                </h4>
            )}
        </div>
    );
}