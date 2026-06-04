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
        loadRoom();

        const interval = setInterval(() => {
            loadRoom();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    async function loadRoom() {
        const { data: roomData } = await supabase
            .from("rooms")
            .select("*")
            .eq("code", id)
            .single();

        setRoom(roomData);

        const { data: quizData } = await supabase
            .from("quizzes")
            .select("*")
            .eq("id", roomData.quiz_id)
            .single();

        setQuiz(quizData);

        if (
            quizData &&
            roomData.current_question >= quizData.questions.length
        ) {
            window.location.href = `/results/${id}`;
        }
    }

    useEffect(() => {
        if (!room || !quiz) return;

        const interval = setInterval(() => {
            const duration = room.question_duration || 10;

            const start = new Date(room.question_started_at);
            const now = new Date();

            const diff = Math.floor(
                duration - (now - start) / 1000
            );

            setTimeLeft(diff > 0 ? diff : 0);

            if (diff <= 0) {
                setAnswered(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [room?.current_question]);

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

    if (!question) {
        window.location.href = `/results/${id}`;
        return null;
    }

    return (
        <div style={{ textAlign: "center" }}>
            <h1>{question.question}</h1>

            <h2>Time left: {timeLeft}</h2>

            <div>
                {question.options.map((o, i) => (
                    <button
                        key={i}
                        disabled={answered || timeLeft <= 0}
                        onClick={() => submitAnswer(i)}
                    >
                        {o}
                    </button>
                ))}
            </div>

            {timeLeft === 0 && (
                <h3>Time is up!</h3>
            )}
        </div>
    );
}