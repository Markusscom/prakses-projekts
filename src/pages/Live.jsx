import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Live() {
    const [room, setRoom] = useState(null);
    const [codeInput, setCodeInput] = useState("");
    const navigate = useNavigate();

    async function createRoom() {
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const { data, error } = await supabase
            .from("rooms")
            .insert([
                {
                    code,
                    quiz_id: null
                }
            ])
            .select()
            .single();

        if (!error) {
            setRoom(data);
        } else {
            console.log(error);
        }
    }

    async function joinRoom() {
        const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .eq("code", codeInput)
            .single();

        if (error || !data) {
            alert("Room not found");
            return;
        }

        navigate(`/play/${data.quiz_id}`);
    }

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Live Mode</h1>

            <div>
                <h2>Teacher</h2>
                <button onClick={createRoom}>
                    Create Room
                </button>

                {room && (
                    <h3>Room Code: {room.code}</h3>
                )}
            </div>

            <hr />

            <div>
                <h2>Student</h2>

                <input
                    placeholder="Enter room code"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                />

                <button onClick={joinRoom}>
                    Join
                </button>
            </div>
        </div>
    );
}