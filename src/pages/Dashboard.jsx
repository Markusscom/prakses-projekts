import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Button from "../components/ui/Button";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false });

    setRooms(data || []);
  }

  async function loadQuizzes() {
    const { data } = await supabase
      .from("quizzes")
      .select("*");

    setQuizzes(data || []);
  }

  async function openRoomFlow() {
    await loadQuizzes();
    setShowSelect(true);
  }

  async function createRoom(quizId) {
    const code = Math.floor(100000 + Math.random() * 900000);

    const { error } = await supabase.from("rooms").insert({
      code,
      quiz_id: quizId,
      status: "waiting",
      current_question: 0,
      created_at: new Date().toISOString()
    });

    if (error) {
      alert(error.message);
      return;
    }

    setShowSelect(false);
    loadRooms();
  }

  async function startLive(roomCode) {
    await supabase
      .from("rooms")
      .update({
        status: "playing",
        current_question: 0
      })
      .eq("code", roomCode);

    navigate(`/teacher-live/${roomCode}`);
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Teacher Dashboard</h1>

      <div className={styles.buttonGroup}>
        <Button onClick={openRoomFlow}>
          Create Live Room
        </Button>
      </div>

      {showSelect && (
        <div className={styles.quizSelect}>
          <h3>Select Quiz</h3>

          {quizzes.map((q) => (
            <div key={q.id} className={styles.quizItem}>
              <span>{q.title}</span>
              <Button onClick={() => createRoom(q.id)}>
                Use
              </Button>
            </div>
          ))}

          <Button onClick={() => setShowSelect(false)}>
            Cancel
          </Button>
        </div>
      )}

      <div className={styles.buttonGroup}>
        <Button onClick={() => navigate("/create")}>
          Create Quiz
        </Button>
      </div>

      <div className={styles.roomList}>
        <h2>Rooms</h2>

        {rooms.map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <div>
              <strong>{room.code}</strong>
              <p>{room.status}</p>
            </div>

            <Button onClick={() => startLive(room.code)}>
              Start
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}