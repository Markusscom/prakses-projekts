import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PlayQuiz() {
    const navigate = useNavigate();
    const location = useLocation();

    const quiz = location.state?.quiz;

    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [locked, setLocked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);

    if (!quiz) {
        return <h2>No quiz selected</h2>;
    }

    const question = quiz.questions[index];

    // TIMER
    useEffect(() => {
        if (locked) return;

        if (timeLeft === 0) {
            handleAnswer(null);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, locked]);

    // RESET TIMER WHEN QUESTION CHANGES
    useEffect(() => {
        setTimeLeft(10);
        setSelected(null);
        setLocked(false);
    }, [index]);

    function handleAnswer(i) {
        if (locked) return;

        setLocked(true);
        setSelected(i);

        const isCorrect = i === question.correctAnswer;

        if (isCorrect) {
            setScore((s) => s + 1);
        }

        setTimeout(() => {
            const next = index + 1;

            if (next < quiz.questions.length) {
                setIndex(next);
            } else {
                navigate("/results", {
                    state: {
                        score: isCorrect ? score + 1 : score,
                        total: quiz.questions.length
                    }
                });
            }
        }, 1000);
    }

    return (
        <div style={{ textAlign: "center", padding: "30px" }}>
            <h2>{quiz.title}</h2>

            <h3>{question.question}</h3>

            <h4>Time left: {timeLeft}</h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "250px", margin: "0 auto" }}>
                {question.answers.map((ans, i) => {
                    let bg = "white";

                    if (locked) {
                        if (i === question.correctAnswer) bg = "lightgreen";
                        if (i === selected && i !== question.correctAnswer) bg = "red";
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            disabled={locked}
                            style={{
                                padding: "10px",
                                background: bg,
                                cursor: locked ? "not-allowed" : "pointer"
                            }}
                        >
                            {ans}
                        </button>
                    );
                })}
            </div>

            <p>Score: {score}</p>
        </div>
    );
}