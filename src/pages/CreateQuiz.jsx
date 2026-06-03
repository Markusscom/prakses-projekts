import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([
        {
            question: "",
            answers: ["", "", "", ""],
            correctAnswer: 0
        }
    ]);

    // QUIZ TITLE
    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

    // QUESTION TEXT
    function updateQuestion(index, value) {
        const updated = [...questions];
        updated[index].question = value;
        setQuestions(updated);
    }

    // ANSWER TEXT
    function updateAnswer(qIndex, aIndex, value) {
        const updated = [...questions];
        updated[qIndex].answers[aIndex] = value;
        setQuestions(updated);
    }

    // CORRECT ANSWER
    function setCorrectAnswer(qIndex, value) {
        const updated = [...questions];
        updated[qIndex].correctAnswer = value;
        setQuestions(updated);
    }

    // ADD QUESTION
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

    // REMOVE QUESTION
    function removeQuestion(index) {
        const updated = questions.filter((_, i) => i !== index);
        setQuestions(updated);
    }

    // SAVE QUIZ (temporary localStorage)
    function saveQuiz() {
        const quiz = {
            id: Date.now(),
            title,
            questions
        };

        const existing = JSON.parse(localStorage.getItem("quizzes") || "[]");
        localStorage.setItem("quizzes", JSON.stringify([...existing, quiz]));

        navigate("/join");
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Create Quiz</h1>

            <input
                placeholder="Quiz title"
                value={title}
                onChange={handleTitleChange}
                style={{ padding: "10px", width: "300px" }}
            />

            <hr />

            {questions.map((q, qIndex) => (
                <div key={qIndex} style={{ marginBottom: "30px" }}>
                    <h3>Question {qIndex + 1}</h3>

                    <input
                        placeholder="Question text"
                        value={q.question}
                        onChange={(e) => updateQuestion(qIndex, e.target.value)}
                        style={{ padding: "8px", width: "400px" }}
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                        {q.answers.map((ans, aIndex) => (
                            <input
                                key={aIndex}
                                placeholder={`Answer ${aIndex + 1}`}
                                value={ans}
                                onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                            />
                        ))}
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <label>Correct answer: </label>
                        <select
                            value={q.correctAnswer}
                            onChange={(e) =>
                                setCorrectAnswer(qIndex, Number(e.target.value))
                            }
                        >
                            {q.answers.map((_, i) => (
                                <option key={i} value={i}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => removeQuestion(qIndex)}
                        style={{ marginTop: "10px" }}
                    >
                        Delete Question
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