import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TeacherLive() {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState("");
    const [room, setRoom] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        loadQuizzes();
    }, []);

    async function loadQuizzes() {
        const { data } = await supabase.from("quizzes").select("*");
        setQuizzes(data || []);
    }

    async function createRoom() {
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const { data, error } = await supabase
            .from("rooms")
            .insert([
                {
                    code,
                    quiz_id: selectedQuiz,
                    status: "waiting",
                    current_question: 0,
                    created_at: new Date()
                }
            ])
            .select()
            .single();

        if (error) return;

        setRoom(data);
        startPlayerPolling(code);
    }

    function startPlayerPolling(code) {
        fetchPlayers(code);

        const interval = setInterval(() => {
            fetchPlayers(code);
        }, 2000);

        return () => clearInterval(interval);
    }

    async function fetchPlayers(code) {
        const { data } = await supabase
            .from("players")
            .select("*")
            .eq("room_code", code);

        setPlayers(data || []);
    }

    async function kickPlayer(id) {
        await supabase
            .from("players")
            .update({ status: "kicked" })
            .eq("id", id);
    }

    async function startGame() {
        await supabase
            .from("rooms")
            .update({
                status: "playing",
                current_question: 0
            })
            .eq("code", room.code);

        setRoom({ ...room, status: "playing" });
    }

    function isExpired(room) {
        if (!room?.created_at) return true;

        const created = new Date(room.created_at);
        const now = new Date();

        const diffHours =
            (now - created) / (1000 * 60 * 60);

        return (
            room.status === null ||
            (room.status === "waiting" &&
                diffHours > 1)
        );
    }

    function getTimeLeft(createdAt) {
        const created = new Date(createdAt);
        const now = new Date();

        const diff = 60 * 60 * 1000 - (now - created);

        if (diff <= 0) return "expired";

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        return `${minutes}:${seconds}`;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Teacher Live</h1>

            <select
                value={selectedQuiz}
                onChange={(e) => setSelectedQuiz(e.target.value)}
            >
                <option value="">Select quiz</option>
                {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>
                        {q.title}
                    </option>
                ))}
            </select>

            <br /><br />

            <button onClick={createRoom}>Create Room</button>

            {room && !isExpired(room) && (
                <div style={{ marginTop: "20px" }}>
                    <h2>Room Code: {room.code}</h2>
                    <h3>Status: {room.status}</h3>
                    <h4>Expires in: {getTimeLeft(room.created_at)}</h4>

                    <h3>
                        Players (
                        {players.filter(p => p.status !== "kicked").length}
                        )
                    </h3>

                    <ul>
                        {players
                            .filter(p => p.status !== "kicked")
                            .map(p => (
                                <li key={p.id}>
                                    {p.nickname}
                                    <button onClick={() => kickPlayer(p.id)}>
                                        Kick
                                    </button>
                                </li>
                            ))}
                    </ul>

                    {room.status === "waiting" && (
                        <button onClick={startGame}>
                            Start Game
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}