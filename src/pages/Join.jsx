import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Join() {
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    function joinRoom() {
        navigate(`/live/${code}`);
    }

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Join Game</h1>

            <input
                placeholder="Enter room code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />

            <button onClick={joinRoom}>
                Join
            </button>
        </div>
    );
}