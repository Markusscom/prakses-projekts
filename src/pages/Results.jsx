import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSupabase } from "../lib/supabase";

const supabase = getSupabase();

export default function Results() {
    const { code } = useParams();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        load();

        const channel = supabase
            .channel("results-" + code)
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "players",
                filter: `room_code=eq.${code}`
            }, load)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    async function load() {
        const { data } = await supabase
            .from("players")
            .select("*")
            .eq("room_code", code)
            .order("score", { ascending: false });

        setPlayers(data || []);
    }

    return (
        <div>
            <h1>Results</h1>
            {players.map((p, i) => (
                <h3 key={p.id}>{i + 1}. {p.nickname} - {p.score}</h3>
            ))}
        </div>
    );
}