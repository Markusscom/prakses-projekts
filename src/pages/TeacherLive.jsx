import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import styles from "./TeacherLive.module.css";

export default function TeacherLive() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    load();

    const interval = setInterval(() => {
      loadPlayers();
    }, 2000);

    return () => clearInterval(interval);
  }, [code]);

  async function load() {
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

    loadPlayers();
  }

  async function loadPlayers() {
    const { data } = await supabase
      .from("players")
      .select("*")
      .eq("room_code", code)
      .order("score", { ascending: false });

    setPlayers(data || []);
  }

  async function startGame() {
    await supabase
      .from("rooms")
      .update({
        status: "playing",
        current_question: 0,
        question_started_at: new Date().toISOString(),
        question_duration: 10
      })
      .eq("code", code);

    load();
  }

  async function nextQuestion() {
    const next = room.current_question + 1;

    if (!quiz || next >= quiz.questions.length) {
      await supabase
        .from("rooms")
        .update({ status: "finished" })
        .eq("code", code);

      navigate(`/results/${code}`);
      return;
    }

    await supabase
      .from("rooms")
      .update({
        current_question: next,
        question_started_at: new Date().toISOString()
      })
      .eq("code", code);

    load();
  }

  async function kickPlayer(playerId) {
    await supabase
      .from("players")
      .delete()
      .eq("id", playerId);

    loadPlayers();
  }

  if (!room) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Room {code}</h1>
        <p className={styles.status}>Status: {room.status}</p>
      </div>

      <div className={styles.panel}>
        <h2>Players ({players.length})</h2>

        {players.length === 0 && (
          <p className={styles.empty}>No players yet</p>
        )}

        {players.map((p, i) => (
          <div key={p.id} className={styles.player}>
            <div className={styles.left}>
              <span className={styles.rank}>{i + 1}</span>
              <span className={styles.name}>
                {p.nickname || "Unknown"}
              </span>
            </div>

            <div className={styles.right}>
              <span className={styles.score}>{p.score}</span>

              <button
                className={styles.kick}
                onClick={() => kickPlayer(p.id)}
              >
                Kick
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        {room.status === "waiting" && (
          <button className={styles.start} onClick={startGame}>
            Start Game
          </button>
        )}

        {room.status === "playing" && (
          <button className={styles.next} onClick={nextQuestion}>
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}