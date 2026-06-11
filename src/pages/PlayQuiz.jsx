import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSupabase } from "../lib/supabase";
import { subscribeRoom } from "../realtime/roomChannel";

const supabase = getSupabase();

export default function PlayQuiz() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [quiz, setQuiz] = useState(null);

  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const nickname = localStorage.getItem("nickname");

  useEffect(() => {
    load();

    const channel = subscribeRoom(
      code,
      (r) => setRoom(r),
      () => {}
    );

    return () => supabase.removeChannel(channel);
  }, [code]);

  useEffect(() => {
    if (!room) return;

    setAnswered(false);
    setSelected(null);

    if (room.current_question >= (quiz?.questions?.length ?? 0)) {
      navigate(`/results/${code}`);
    }
  }, [room?.current_question]);

  useEffect(() => {
    if (!room) return;

    const interval = setInterval(() => {
      const start = new Date(room.question_started_at).getTime();
      const duration = (room.question_duration || 10) * 1000;
      const diff = Math.max(0, Math.floor((start + duration - Date.now()) / 1000));

      setTimeLeft(diff);
    }, 200);

    return () => clearInterval(interval);
  }, [room?.question_started_at, room?.question_duration]);

  useEffect(() => {
    if (timeLeft !== 0) return;
    if (!room) return;

    nextQuestion();
  }, [timeLeft]);

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

  async function answer(index) {
    if (answered) return;

    const q = quiz.questions[room.current_question];
    const correct = index === q.correctAnswer;

    const { data: player } = await supabase
      .from("players")
      .select("*")
      .eq("room_code", code)
      .eq("nickname", nickname)
      .single();

    await supabase.from("answers").insert({
      room_code: code,
      nickname,
      question_index: room.current_question,
      selected_index: index,
      is_correct: correct
    });

    if (correct) {
      await supabase
        .from("players")
        .update({ score: (player.score || 0) + 1 })
        .eq("id", player.id);
    }

    setAnswered(true);
    setSelected(index);

    await checkAllAnswered();
  }

  async function checkAllAnswered() {
    const { data: players } = await supabase
      .from("players")
      .select("*")
      .eq("room_code", code)
      .eq("status", "active");

    const { data: answers } = await supabase
      .from("answers")
      .select("*")
      .eq("room_code", code)
      .eq("question_index", room.current_question);

    if (players.length === answers.length) {
      await nextQuestion();
    }
  }

  async function nextQuestion() {
    if (!room) return;

    const next = room.current_question + 1;

    if (next >= quiz.questions.length) {
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

  if (!room || !quiz) return <h2>Loading...</h2>;

  if (room.status !== "playing") return <h2>Waiting...</h2>;

  const q = quiz.questions[room.current_question];

  return (
    <div>
      <h2>Time left: {timeLeft}s</h2>

      <h1>{q.question}</h1>

      {q.answers.map((a, i) => (
        <button
          key={i}
          disabled={answered}
          onClick={() => answer(i)}
        >
          {a}
        </button>
      ))}

      {answered && <h3>Answer locked</h3>}
    </div>
  );
}