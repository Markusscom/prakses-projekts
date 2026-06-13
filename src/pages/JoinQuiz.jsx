import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import styles from "./JoinQuiz.module.css";

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

        if (!error) {
            setQuizzes(data);
        }
    }

    function startQuiz(quiz) {
        navigate("/play", { state: { quiz } });
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Join Quiz</h1>

            {quizzes.length === 0 && <p>No quizzes found</p>}

            <div className={styles.quizList}>
                {quizzes.map((q) => (
                    <div key={q.id} className={styles.quizCard}>
                        <h3 className={styles.quizTitle}>{q.title}</h3>
                        <Button onClick={() => startQuiz(q)}>
                            Start
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}