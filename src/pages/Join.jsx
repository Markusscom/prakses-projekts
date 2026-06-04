import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Join() {
    const [code, setCode] = useState("");
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    async function joinRoom() {
        if (!code || !nickname) return;

        const { data: room, error } = await supabase
            .from("rooms")
            .select("*")
            .eq("code", code)
            .single();

        if (error || !room) {
            alert("Room not found");
            return;
        }

        localStorage.setItem("nickname", nickname);

        const { error: insertError } = await supabase
            .from("players")
            .insert([
                {
                    room_code: code,
                    nickname,
                    score: 0,
                    status: "active"
                }
            ]);

        if (insertError) {
            console.log(insertError);
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
                onChange={(e) => setNickname(e.target.value)}
            />

            <br />

            <button onClick={joinRoom}>
                Join
            </button>
        </div>
    );
}