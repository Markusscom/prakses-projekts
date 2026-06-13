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

  useEffect(() => {
    load();

    const interval = setInterval(loadRoom, 1000);

    return () => clearInterval(interval);
  }, [code]);

  async function load() {
    await loadRoom();

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

    const { data: roomData } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", code)
      .single();

    setRoom(roomData);

    const { data: quizData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", roomData.quiz_id)
      .single();

    setQuiz(quizData);
  }

  async function loadRoom() {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", code)
      .single();

    setRoom(data);
  }

  useEffect(() => {
    setAnswered(false);
  }, [room?.current_question]);

  useEffect(() => {
    if (!room || !quiz) return;

    if (room.status === "finished") {
      navigate(`/results/${code}`);
    }
  }, [room, quiz]);

  async function answer(index) {
    if (answered) return;

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

    if (isCorrect) {
      await supabase
        .from("players")
        .update({
          score: (player.score || 0) + 1
        })
        .eq("id", player.id);
    }

    setAnswered(true);
  }

  if (!room || !quiz) return <h2>Loading...</h2>;

  if (room.status !== "playing") return <h2>Waiting...</h2>;

  const q = quiz.questions[room.current_question];

  return (
    <div className={styles.container}>
      <h2>Question {room.current_question + 1}</h2>

      <h1 className={styles.questionTitle}>{q.question}</h1>

      <div className={styles.answerGrid}>
        {q.answers.map((a, i) => (
          <Button
            key={i}
            disabled={answered}
            onClick={() => answer(i)}
            className={styles.answerButton}
          >
            {a}
          </Button>
        ))}
      </div>

      {answered && <h3 className={styles.waitingText}>Waiting for next question...</h3>}
    </div>
  );
}