import { useState } from "react";
import { supabase } from "../lib/supabase";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import styles from "./CreateQuiz.module.css";

export default function CreateQuiz() {
    const [title, setTitle] = useState("");

    const [questions, setQuestions] = useState([
        {
            question: "",
            answers: ["", "", "", ""],
            correctAnswer: 0
        }
    ]);

    function handleTitle(e) {
        setTitle(e.target.value);
    }

    function updateQuestion(index, value) {
        const copy = [...questions];
        copy[index].question = value;
        setQuestions(copy);
    }

    function updateAnswer(qIndex, aIndex, value) {
        const copy = [...questions];
        copy[qIndex].answers[aIndex] = value;
        setQuestions(copy);
    }

    function setCorrect(qIndex, value) {
        const copy = [...questions];
        copy[qIndex].correctAnswer = Number(value);
        setQuestions(copy);
    }

    function addQuestion() {
        setQuestions([
            ...questions,
            {
                question: "",
                answers: ["", "", "", ""],
                correctAnswer: 0
            }
        ]);
    }

    function removeQuestion(index) {
        const copy = questions.filter((_, i) => i !== index);
        setQuestions(copy);
    }

    async function saveQuiz() {
        if (!title) {
            alert("Ievadi nosaukumu!");
            return;
        }

        const { error } = await supabase
            .from("quizzes")
            .insert([
                {
                    title,
                    questions
                }
            ]);

        if (error) {
            console.log(error);
            alert("Kļūda saglabājot");
        } else {
            alert("Quiz saglabāts!");
            setTitle("");
            setQuestions([
                {
                    question: "",
                    answers: ["", "", "", ""],
                    correctAnswer: 0
                }
            ]);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create Quiz</h1>

            <Input
                placeholder="Quiz title"
                value={title}
                onChange={handleTitle}
            />

            {questions.map((q, qIndex) => (
                <div key={qIndex} className={styles.questionContainer}>
                    <h3>Question {qIndex + 1}</h3>

                    <Input
                        placeholder="Question"
                        value={q.question}
                        onChange={(e) =>
                            updateQuestion(qIndex, e.target.value)
                        }
                    />

                    <div className={styles.answersContainer}>
                        {q.answers.map((ans, aIndex) => (
                            <Input
                                key={aIndex}
                                placeholder={`Answer ${aIndex + 1}`}
                                value={ans}
                                onChange={(e) =>
                                    updateAnswer(qIndex, aIndex, e.target.value)
                                }
                            />
                        ))}
                    </div>

                    <div>
                        <label>Correct answer: </label>

                        <select
                            className={styles.selectField}
                            value={q.correctAnswer}
                            onChange={(e) =>
                                setCorrect(qIndex, e.target.value)
                            }
                        >
                            {q.answers.map((_, i) => (
                                <option key={i} value={i}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button variant="danger" onClick={() => removeQuestion(qIndex)}>
                        Delete question
                    </Button>
                </div>
            ))}

            <Button onClick={addQuestion}>
                + Add Question
            </Button>

            <Button onClick={saveQuiz} style={{marginLeft: "10px"}}>
                Save Quiz
            </Button>
        </div>
    );
}
