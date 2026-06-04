import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Join() {
    const [code, setCode] = useState("");
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    async function joinRoom() {
        if (!code || !nickname) return;

        const { data: room } = await supabase
            .from("rooms")
            .select("*")
            .eq("code", code)
            .single();

        if (!room) {
            alert("Room not found");
            return;
        }

        const { error } = await supabase
            .from("players")
            .insert([
                {
                    room_code: code,
                    nickname,
                    score: 0,
                    status: "active"
                }
            ]);

        if (error) {
            console.log(error);
            return;
        }

        navigate(`/live/${code}`);
    }

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Join Game</h1>

            <input
                placeholder="Room code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />

            <br />

            <input
                placeholder="Nickname"
                value={nickname}
                onChange={(e) =>
                    setNickname(e.target.value)
                }
            />

            <br />

            <button onClick={joinRoom}>
                Join
            </button>
        </div>
    );
}