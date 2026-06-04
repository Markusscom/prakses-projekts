import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Join() {
    const [code, setCode] = useState("");
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    async function joinRoom() {
        const { data: room } = await supabase
            .from("rooms")
            .select("*")
            .eq("code", code)
            .single();

        if (!room) return alert("Room not found");

        localStorage.setItem("nickname", nickname);

        await supabase.from("players").insert([
            {
                room_code: code,
                nickname,
                score: 0,
                status: "active"
            }
        ]);

        navigate(`/live/${code}`);
    }

    return (
        <div>
            <h1>Join</h1>

            <input placeholder="Code" value={code} onChange={e => setCode(e.target.value)} />
            <input placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} />

            <button onClick={joinRoom}>Join</button>
        </div>
    );
}