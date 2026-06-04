import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TeacherLive() {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState("");
    const [roomCode, setRoomCode] = useState("");

    useEffect(() => {
        loadQuizzes();
    }, []);

    async function loadQuizzes() {
        const { data, error } = await supabase
            .from("quizzes")
            .select("*");

        if (!error) {
            setQuizzes(data);
        }
    }

    async function createRoom() {
        if (!selectedQuiz) {
            alert("Select a quiz first");
            return;
        }

        const code = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const { error } = await supabase
            .from("rooms")
            .insert([
                {
                    code: code,
                    quiz_id: selectedQuiz
                }
            ]);

        if (error) {
            console.log(error);
            alert("Failed to create room");
            return;
        }

        setRoomCode(code);
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Teacher Live</h1>

            <select
                value={selectedQuiz}
                onChange={(e) =>
                    setSelectedQuiz(e.target.value)
                }
            >
                <option value="">
                    Select Quiz
                </option>

                {quizzes.map((quiz) => (
                    <option
                        key={quiz.id}
                        value={quiz.id}
                    >
                        {quiz.title}
                    </option>
                ))}
            </select>

            <br />
            <br />

            <button onClick={createRoom}>
                Create Room
            </button>

            {roomCode && (
                <div>
                    <h2>Room Code</h2>
                    <h1>{roomCode}</h1>
                </div>
            )}
        </div>
    );
}