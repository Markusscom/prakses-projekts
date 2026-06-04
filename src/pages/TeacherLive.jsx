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
        if (!selectedQuiz) return;

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const { data } = await supabase
            .from("rooms")
            .insert([
                {
                    code,
                    quiz_id: selectedQuiz,
                    status: "waiting",
                    current_question: 0,
                    question_started_at: new Date(),
                    question_duration: 10
                }
            ])
            .select()
            .single();

        setRoom(data);
        startPolling(code);
    }

    function startPolling(code) {
        fetchPlayers(code);

        const interval = setInterval(() => {
            fetchPlayers(code);
            fetchRoom(code);
        }, 2000);

        return () => clearInterval(interval);
    }

    async function fetchRoom(code) {
        const { data } = await supabase
            .from("rooms")
            .select("*")
            .eq("code", code)
            .single();

        setRoom(data);
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
                current_question: 0,
                question_started_at: new Date()
            })
            .eq("code", room.code);

        setRoom({ ...room, status: "playing" });
    }

    async function nextQuestion() {
        await supabase
            .from("rooms")
            .update({
                current_question: room.current_question + 1,
                question_started_at: new Date()
            })
            .eq("code", room.code);

        setRoom({
            ...room,
            current_question: room.current_question + 1
        });
    }

    function getTimeLeft(createdAt, duration = 10) {
        if (!createdAt) return duration;

        const start = new Date(createdAt);
        const now = new Date();

        const diff = Math.floor(
            duration - (now - start) / 1000
        );

        return diff > 0 ? diff : 0;
    }

    if (!room) {
        return (
            <div>
                <h1>Teacher Live</h1>

                <select
                    value={selectedQuiz}
                    onChange={(e) =>
                        setSelectedQuiz(e.target.value)
                    }
                >
                    <option value="">Select quiz</option>
                    {quizzes.map((q) => (
                        <option key={q.id} value={q.id}>
                            {q.title}
                        </option>
                    ))}
                </select>

                <button onClick={createRoom}>
                    Create Room
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Teacher Live</h1>

            <h2>Room Code: {room.code}</h2>
            <h3>Status: {room.status}</h3>

            <h4>
                Time left:{" "}
                {getTimeLeft(
                    room.question_started_at,
                    room.question_duration
                )}
            </h4>

            <div>
                <button onClick={startGame}>
                    Start Game
                </button>

                <button onClick={nextQuestion}>
                    Next Question
                </button>
            </div>

            <h3>
                Players (
                {players.filter(p => p.status !== "kicked").length}
                )
            </h3>

            <ul>
                {players
                    .filter(p => p.status !== "kicked")
                    .map((p) => (
                        <li key={p.id}>
                            {p.nickname}
                            <button onClick={() => kickPlayer(p.id)}>
                                Kick
                            </button>
                        </li>
                    ))}
            </ul>
        </div>
    );
}