import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Button from "../components/ui/Button";
import Logo from "../assets/logo.png";
import "./Start.module.css";

export default function Start() {
  const navigate = useNavigate();

  async function goTeacher() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      navigate("/profile");
      return;
    }

    if (profile.role !== "teacher") {
      alert("Nav atļaujas");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="start-page">
      <div className="start-card">
        <img
          src={Logo}
          alt="Quizzard"
          className="start-logo"
        />

        <p className="start-subtitle">
          Create quizzes, host games and challenge players in real time.
        </p>

        <div className="start-buttons">
          <Button onClick={() => navigate("/join")}>
            Join Game
          </Button>

          <Button onClick={goTeacher}>
            Teacher Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}