import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { subscribeRoom } from "../realtime/roomChannel";

export default function TeacherLive() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    supabase.from("quizzes").select("id,title").then(({ data }) => {
      setQuizzes(data || []);
    });
  }, []);

  useEffect(() => {
    if (!room?.code) return;

    const channel = subscribeRoom(
      room.code,
      setRoom,
      () => loadPlayers(room.code)
    );

    return () => supabase.removeChannel(channel);
  }, [room?.code]);

  async function loadPlayers(code) {
    const { data } = await supabase
      .from("players")
      .select("*")
      .eq("room_code", code);

    setPlayers(data || []);
  }

  async function createRoom() {
    const code = String(Math.floor(100000 + Math.random() * 900000));

    const { data } = await supabase
      .from("rooms")
      .insert({
        code,
        quiz_id: selectedQuiz,
        status: "waiting",
        current_question: 0,
        question_started_at: new Date().toISOString()
      })
      .select()
      .single();

    setRoom(data);
  }

  async function startGame() {
    await supabase
      .from("rooms")
      .update({
        status: "playing",
        current_question: 0,
        question_started_at: new Date().toISOString()
      })
      .eq("code", room.code);
  }

  async function nextQuestion() {
    await supabase
      .from("rooms")
      .update({
        current_question: room.current_question + 1,
        question_started_at: new Date().toISOString()
      })
      .eq("code", room.code);
  }

  async function kick(id) {
    await supabase
      .from("players")
      .update({ status: "kicked" })
      .eq("id", id);
  }

  if (!room) {
    return (
      <div>
        <select onChange={(e) => setSelectedQuiz(e.target.value)}>
          <option value="">Select quiz</option>
          {quizzes.map(q => (
            <option key={q.id} value={q.id}>{q.title}</option>
          ))}
        </select>

        <button onClick={createRoom}>Create</button>
      </div>
    );
  }

  return (
    <div>
      <h1>ROOM {room.code}</h1>
      <h2>{room.status}</h2>

      <button onClick={startGame}>Start</button>
      <button onClick={nextQuestion}>Next</button>

      <h3>Players ({players.length})</h3>

      {players.map(p => (
        <div key={p.id}>
          {p.nickname}
          <button onClick={() => kick(p.id)}>kick</button>
        </div>
      ))}
    </div>
  );
}