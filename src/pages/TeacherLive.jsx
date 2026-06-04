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

    useEffect(() => {
        if (!room?.code) return;

        const channel = supabase
            .channel("teacher-room")
            .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `code=eq.${room.code}` }, (p) => {
                setRoom(p.new);
            })
            .on("postgres_changes", { event: "*", schema: "public", table: "players", filter: `room_code=eq.${room.code}` }, () => {
                fetchPlayers(room.code);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [room?.code]);

    async function loadQuizzes() {
        const { data } = await supabase.from("quizzes").select("*");
        setQuizzes(data || []);
    }

    async function fetchPlayers(code) {
        const { data } = await supabase.from("players").select("*").eq("room_code", code);
        setPlayers(data || []);
    }

    async function createRoom() {
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const { data } = await supabase
            .from("rooms")
            .insert([
                {
                    code,
                    quiz_id: selectedQuiz,
                    status: "waiting",
                    current_question: 0,
                    question_started_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        setRoom(data);
        fetchPlayers(code);
    }

    async function startGame() {
        await supabase
            .from("rooms")
            .update({
                status: "playing",
                current_question: 0,
                question_started_at: new Date().toISOString()
            })
            .eq("code", room.code);
    }

    async function nextQuestion() {
        await supabase
            .from("rooms")
            .update({
                current_question: room.current_question + 1,
                question_started_at: new Date().toISOString()
            })
            .eq("code", room.code);
    }

    async function kick(id) {
        await supabase.from("players").update({ status: "kicked" }).eq("id", id);
    }

    if (!room) {
        return (
            <div>
                <select value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)}>
                    <option value="">Select quiz</option>
                    {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
                </select>
                <button onClick={createRoom}>Create Room</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Room: {room.code}</h2>
            <h3>Status: {room.status}</h3>

            <button onClick={startGame} disabled={room.status !== "waiting"}>
                Start Game
            </button>

            <button onClick={nextQuestion} disabled={room.status !== "playing"}>
                Next Question
            </button>

            <h3>Players ({players.length})</h3>

            {players.map(p => (
                <div key={p.id}>
                    {p.nickname}
                    <button onClick={() => kick(p.id)}>Kick</button>
                </div>
            ))}
        </div>
    );
}