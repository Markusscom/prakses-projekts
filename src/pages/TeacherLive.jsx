import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

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
      .eq("room_code", code);

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
  }

  async function kickPlayer(userId) {
    await supabase
      .from("players")
      .update({ status: "kicked" })
      .eq("user_id", userId);
  }

  if (!room) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Teacher Room: {code}</h1>

      <h3>Status: {room.status}</h3>

      <h3>Players ({players.length})</h3>

      {players.map((p) => (
        <div key={p.id}>
          {p.user_id} | score: {p.score}

          <button onClick={() => kickPlayer(p.user_id)}>
            Kick
          </button>
        </div>
      ))}

      {room.status === "waiting" && (
        <button onClick={startGame}>
          Start Game
        </button>
      )}

      {room.status === "playing" && (
        <button onClick={nextQuestion}>
          Next Question
        </button>
      )}
    </div>
  );
}