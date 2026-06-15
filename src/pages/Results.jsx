import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import styles from "./Results.module.css";

export default function Results() {
    const { code } = useParams();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        load();

        const channel = supabase
            .channel("results-" + code)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "players",
                    filter: `room_code=eq.${code}`
                },
                load
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [code]);

    async function load() {
        const { data } = await supabase
            .from("players")
            .select("*")
            .eq("room_code", code)
            .order("score", { ascending: false });

        setPlayers(data || []);
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Results</h1>
            <p className={styles.subtitle}>Room code: {code}</p>

            <div className={styles.board}>
                {players.map((p, i) => (
                    <div
                        key={p.id}
                        className={`${styles.row} ${
                            i === 0
                                ? styles.first
                                : i === 1
                                ? styles.second
                                : i === 2
                                ? styles.third
                                : ""
                        }`}
                    >
                        <div className={styles.rank}>{i + 1}</div>
                        <div className={styles.name}>{p.nickname}</div>
                        <div className={styles.score}>{p.score}</div>
                    </div>
                ))}

                {players.length === 0 && (
                    <p className={styles.empty}>No players yet</p>
                )}
            </div>
        </div>
    );
}