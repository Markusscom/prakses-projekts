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
        const { data } = await supabase
            .from("quizzes")
            .select("*");

        setQuizzes(data || []);
    }

    async function createRoom() {
        if (!selectedQuiz) {
            alert("Select a quiz first");
            return;
        }

        const code = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const { data, error } = await supabase
            .from("rooms")
            .insert([
                {
                    code,
                    quiz_id: selectedQuiz,
                    status: "waiting",
                    current_question: 0
                }
            ])
            .select()
            .single();

        if (error) {
            console.log(error);
            return;
        }

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

    async function kickPlayer(playerId) {
        await supabase
            .from("players")
            .update({ status: "kicked" })
            .eq("id", playerId);
    }

    async function startGame() {
        if (!room) return;

        const { error } = await supabase
            .from("rooms")
            .update({
                status: "playing",
                current_question: 0
            })
            .eq("code", room.code);

        if (!error) {
            setRoom({
                ...room,
                status: "playing"
            });
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Teacher Live</h1>

            <select
                value={selectedQuiz}
                onChange={(e) =>
                    setSelectedQuiz(e.target.value)
                }
            >
                <option value="">
                    Select quiz
                </option>

                {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>
                        {q.title}
                    </option>
                ))}
            </select>

            <br />
            <br />

            <button onClick={createRoom}>
                Create Room
            </button>

            {room && (
                <div style={{ marginTop: "20px" }}>
                    <h2>Room Code: {room.code}</h2>
                    <h3>Status: {room.status}</h3>

                    {/* PLAYERS */}
                    <h3>
                        Players (
                        {
                            players.filter(
                                (p) =>
                                    p.status !== "kicked"
                            ).length
                        }
                        )
                    </h3>

                    <ul>
                        {players
                            .filter(
                                (p) =>
                                    p.status !== "kicked"
                            )
                            .map((p) => (
                                <li key={p.id}>
                                    {p.nickname}{" "}

                                    <button
                                        onClick={() =>
                                            kickPlayer(p.id)
                                        }
                                    >
                                        Kick
                                    </button>
                                </li>
                            ))}
                    </ul>

                    {room.status ===
                        "waiting" && (
                        <button onClick={startGame}>
                            Start Game
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}