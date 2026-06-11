import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const supabase = getSupabase();

export default function Join() {
    const [code, setCode] = useState("");
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    export default function joinRoom(code) {
    return async function () {
        const { data: user } = await supabase.auth.getUser();

        await supabase.from("players").insert({
        room_code: code,
        user_id: user.user.id,
        score: 0,
        status: "active"
        });
    };
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