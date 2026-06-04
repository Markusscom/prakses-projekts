import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Results() {
    const { code } = useParams();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        load();

        const t = setInterval(load, 2000);
        return () => clearInterval(t);
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

            {players[0] && <h2>Winner: {players[0].nickname}</h2>}

            {players.map(p => (
                <div key={p.id}>
                    {p.nickname} - {p.score}
                </div>
            ))}
        </div>
    );
}