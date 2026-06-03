import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PlayQuiz() {
    const navigate = useNavigate();
    const location = useLocation();

    const quiz = location.state?.quiz;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);

    if (!quiz) {
        return <h2>No quiz selected</h2>;
    }

    const question = quiz.questions[currentIndex];

    function handleAnswer(index) {
        let newScore = score;

        if (index === question.correctAnswer) {
            newScore = score + 1;
            setScore(newScore);
        }

        const next = currentIndex + 1;

        if (next < quiz.questions.length) {
            setCurrentIndex(next);
        } else {
            navigate("/results", {
                state: {
                    score: newScore,
                    total: quiz.questions.length
                }
            });
        }
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{quiz.title}</h2>

            <h3>{question.question}</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "200px", margin: "0 auto" }}>
                {question.answers.map((ans, i) => (
                    <button key={i} onClick={() => handleAnswer(i)}>
                        {ans}
                    </button>
                ))}
            </div>

            <p>Score: {score}</p>
        </div>
    );
}