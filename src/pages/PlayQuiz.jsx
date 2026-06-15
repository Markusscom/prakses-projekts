import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import styles from "./PlayQuiz.module.css";
import Button from "../components/ui/Button";

export default function PlayQuiz() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answered, setAnswered] = useState(false);

  async function load() {
    const { data: roomData } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", code)
      .single();

    if (!roomData) return;

    setRoom(roomData);

    const { data: quizData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", roomData.quiz_id)
      .single();

    setQuiz(quizData);

    const { data: user } = await supabase.auth.getUser();

    const { data: player } = await supabase
      .from("players")
      .select("*")
      .eq("room_code", code)
      .eq("user_id", user.user.id)
      .single();

    if (player?.status === "kicked") {
      navigate("/join");
    }
  }

  useEffect(() => {
    load();

    const interval = setInterval(() => {
      load();
    }, 2000);

    return () => clearInterval(interval);
  }, [code]);

  useEffect(() => {
    setAnswered(false);
  }, [room?.current_question]);

  useEffect(() => {
    if (room?.status === "finished") {
      navigate(`/results/${code}`);
    }
  }, [room, code, navigate]);

  async function answer(index) {
    if (answered || !room || !quiz) return;

    const q = quiz.questions[room.current_question];
    const isCorrect = index === q.correctAnswer;

    const { data: user } = await supabase.auth.getUser();

    const { data: player } = await supabase
      .from("players")
      .select("*")
      .eq("room_code", code)
      .eq("user_id", user.user.id)
      .single();

    await supabase.from("answers").insert({
      room_code: code,
      user_id: user.user.id,
      question_index: room.current_question,
      selected_index: index,
      is_correct: isCorrect
    });

    if (isCorrect && player) {
      await supabase
        .from("players")
        .update({
          score: (player.score || 0) + 1
        })
        .eq("id", player.id);
    }

    setAnswered(true);
  }

  if (!room || !quiz) {
    return (
      <div className={styles.center}>
        Loading...
      </div>
    );
  }

  if (room.status !== "playing") {
    return (
      <div className={styles.center}>
        Waiting for game to start...
      </div>
    );
  }

  const q = quiz.questions[room.current_question];

  return (
    <div className={styles.container}>
      <h2 className={styles.questionNumber}>
        Question {room.current_question + 1}
      </h2>

      <h1 className={styles.questionTitle}>
        {q.question}
      </h1>

      <div className={styles.answerGrid}>
        {q.answers.map((a, i) => (
          <Button
            key={i}
            disabled={answered}
            onClick={() => answer(i)}
            className={`${styles.answerButton} ${answered ? styles.locked : ""}`}
          >
            {a}
          </Button>
        ))}
      </div>

      {answered && (
        <h3 className={styles.waitingText}>
          Waiting for next question...
        </h3>
      )}
    </div>
  );
}