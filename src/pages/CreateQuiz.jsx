import { useState } from "react";
import { supabase } from "../lib/supabase";

const supabase = getSupabase();

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
        <div style={{ padding: "20px" }}>
            <h1>Create Quiz</h1>

            {/* TITLE */}
            <input
                placeholder="Quiz title"
                value={title}
                onChange={handleTitle}
                style={{ padding: "10px", width: "300px" }}
            />

            <hr />

            {questions.map((q, qIndex) => (
                <div key={qIndex} style={{ marginBottom: "20px" }}>
                    <h3>Question {qIndex + 1}</h3>

                    <input
                        placeholder="Question"
                        value={q.question}
                        onChange={(e) =>
                            updateQuestion(qIndex, e.target.value)
                        }
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "10px" }}>
                        {q.answers.map((ans, aIndex) => (
                            <input
                                key={aIndex}
                                placeholder={`Answer ${aIndex + 1}`}
                                value={ans}
                                onChange={(e) =>
                                    updateAnswer(qIndex, aIndex, e.target.value)
                                }
                            />
                        ))}
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <label>Correct answer: </label>

                        <select
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

                    <button onClick={() => removeQuestion(qIndex)}>
                        Delete question
                    </button>

                    <hr />
                </div>
            ))}

            <button onClick={addQuestion}>
                + Add Question
            </button>

            <br /><br />

            <button onClick={saveQuiz}>
                Save Quiz
            </button>
        </div>
    );
}