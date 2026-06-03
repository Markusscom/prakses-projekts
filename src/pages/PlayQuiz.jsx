import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function PlayQuiz() {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        loadQuiz();
    }, []);

    async function loadQuiz() {
        const { data, error } = await supabase
            .from("quizzes")
            .select("*")
            .eq("id", quizId)
            .single();

        if (!error) {
            setQuiz(data);
        }
    }

    if (!quiz) return <h2>Loading...</h2>;

    const question = quiz.questions[index];

    return (
        <div>
            <h2>{quiz.title}</h2>
            <h3>{question.question}</h3>
        </div>
    );
}