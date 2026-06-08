import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSupabase } from "../lib/supabase";

const supabase = getSupabase();
import { subscribeRoom } from "../realtime/roomChannel";

export default function PlayQuiz() {
  const { code } = useParams();
  const [room, setRoom] = useState(null);
  const [quiz, setQuiz] = useState(null);

  const nickname = localStorage.getItem("nickname");

  useEffect(() => {
    load();

    const channel = subscribeRoom(code, setRoom, () => {});
    return () => supabase.removeChannel(channel);
  }, []);

  async function load() {
    const { data: r } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", code)
      .single();

    setRoom(r);

    const { data: q } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", r.quiz_id)
      .single();

    setQuiz(q);
  }

  if (!room || !quiz) return <h2>Loading...</h2>;

  if (room.status === "waiting") return <h2>Waiting...</h2>;

  if (room.current_question >= quiz.questions.length) {
    window.location.href = `/results/${code}`;
  }

  const q = quiz.questions[room.current_question];

  return (
    <div>
      <h1>{q.question}</h1>

      {q.options.map((o, i) => (
        <button key={i}>{o}</button>
      ))}
    </div>
  );
}