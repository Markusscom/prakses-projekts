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

        const interval = setInterval(() => {
            loadRoom();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    async function load() {
        const { data: r } = await supabase
            .from("rooms")
            .select("*")
            .eq("code", id)
            .single();

        setRoom(r);

        const { data: q } = await supabase
            .from("quizzes")
            .select("*")
            .eq("id", r.quiz_id)
            .single();

        setQuiz(q);
    }

    async function loadRoom() {
        const { data: r } = await supabase
            .from("rooms")
            .select("*")
            .eq("code", id)
            .single();

        setRoom(r);
    }

    // TIMER CALCULATION
    useEffect(() => {
        if (!room) return;

        const interval = setInterval(() => {
            const duration = room.question_duration || 10;
            const start = new Date(room.question_started_at);
            const now = new Date();

            const diff = Math.floor(
                duration - (now - start) / 1000
            );

            setTimeLeft(diff > 0 ? diff : 0);

            if (diff <= 0) {
                goNextQuestion();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [room?.current_question]);

    // AUTO NEXT QUESTION
    async function goNextQuestion() {
        if (!room) return;

        await supabase
            .from("rooms")
            .update({
                current_question:
                    room.current_question + 1,
                question_started_at: new Date(),
                question_duration: 10
            })
            .eq("code", id);

        setAnswered(false);
    }

    // SUBMIT ANSWER
    async function submitAnswer(i) {
        if (answered) return;

        const { data: player } = await supabase
            .from("players")
            .select("*")
            .eq("room_code", id)
            .eq("nickname", nickname)
            .single();

        const question =
            quiz.questions[room.current_question];

        const correct = i === question.correct;

        await supabase.from("answers").insert([
            {
                room_code: id,
                player_id: player.id,
                question_index: room.current_question,
                selected_index: i,
                is_correct: correct
            }
        ]);

        if (correct) {
            await supabase
                .from("players")
                .update({
                    score: player.score + 1
                })
                .eq("id", player.id);
        }

        setAnswered(true);
    }

    if (!room || !quiz) return <h2>Loading...</h2>;

    const question =
        quiz.questions[room.current_question];

    if (!question) return <h2>Game finished</h2>;

    return (
        <div style={{ textAlign: "center" }}>
            <h1>{question.question}</h1>

            <h2>Time left: {timeLeft}</h2>

            {question.options.map((o, i) => (
                <button
                    key={i}
                    disabled={answered}
                    onClick={() => submitAnswer(i)}
                >
                    {o}
                </button>
            ))}
        </div>
    );
}