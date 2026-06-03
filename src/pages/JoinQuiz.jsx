import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinQuiz() {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("quizzes") || "[]");
        setQuizzes(data);
    }, []);

    function startQuiz(quiz) {
        navigate("/play", { state: { quiz } });
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Join Quiz</h1>

            {quizzes.length === 0 && <p>No quizzes yet</p>}

            {quizzes.map((q) => (
                <div
                    key={q.id}
                    style={{
                        border: "1px solid black",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                >
                    <h3>{q.title}</h3>
                    <button onClick={() => startQuiz(q)}>
                        Start
                    </button>
                </div>
            ))}
        </div>
    );
}