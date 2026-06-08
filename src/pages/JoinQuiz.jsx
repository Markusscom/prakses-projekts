import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabase";

const supabase = getSupabase();
import { useNavigate } from "react-router-dom";

export default function JoinQuiz() {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    async function fetchQuizzes() {
        const { data, error } = await supabase
            .from("quizzes")
            .select("*");

        console.log("DATA:", data);
        console.log("ERROR:", error);

        if (!error) {
            setQuizzes(data);
        }
    }

    function startQuiz(quiz) {
        navigate("/play", { state: { quiz } });
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Join Quiz</h1>

            {quizzes.length === 0 && <p>No quizzes found</p>}

            {quizzes.map((q) => (
                <div key={q.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                    <h3>{q.title}</h3>
                    <button onClick={() => startQuiz(q)}>
                        Start
                    </button>
                </div>
            ))}
        </div>
    );
}