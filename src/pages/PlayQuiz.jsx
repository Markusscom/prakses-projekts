import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function PlayQuiz() {
    const { id } = useParams();

    const [room, setRoom] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const [answered, setAnswered] = useState(false);

    const nickname = localStorage.getItem("nickname");

    useEffect(() => {
        load();

        const channel = supabase
            .channel("player-room")
            .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `code=eq.${id}` }, (p) => {
                setRoom(p.new);
                setAnswered(false);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    useEffect(() => {
        if (!room) return;

        const t = setInterval(() => {
            const start = new Date(room.question_started_at);
            const now = new Date();
            const diff = Math.max(0, 10 - Math.floor((now - start) / 1000));
            setTimeLeft(diff);

            if (diff === 0) setAnswered(false);
        }, 500);

        return () => clearInterval(t);
    }, [room?.current_question]);

    async function load() {
        const { data: r } = await supabase.from("rooms").select("*").eq("code", id).single();
        setRoom(r);

        const { data: q } = await supabase.from("quizzes").select("*").eq("id", r.quiz_id).single();
        setQuiz(q);
    }

    async function answer(i) {
        if (answered) return;

        const { data: player } = await supabase
            .from("players")
            .select("*")
            .eq("room_code", id)
            .eq("nickname", nickname)
            .single();

        const question = quiz.questions[room.current_question];
        const correct = i === question.correct;

        await supabase.from("answers").insert({
            room_code: id,
            player_id: player.id,
            question_index: room.current_question,
            selected_index: i,
            is_correct: correct
        });

        if (correct) {
            await supabase.from("players").update({ score: player.score + 1 }).eq("id", player.id);
        }

        setAnswered(true);
    }

    if (!room || !quiz) return <h2>Loading...</h2>;

    if (room.status === "waiting") return <h2>Waiting for teacher...</h2>;

    if (room.current_question >= quiz.questions.length) {
        window.location.href = `/results/${id}`;
        return null;
    }

    const q = quiz.questions[room.current_question];

    return (
        <div>
            <h1>{q.question}</h1>
            <h2>{timeLeft}</h2>

            {q.options.map((o, i) => (
                <button key={i} disabled={answered} onClick={() => answer(i)}>
                    {o}
                </button>
            ))}
        </div>
    );
}