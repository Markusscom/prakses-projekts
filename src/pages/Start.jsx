import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Start() {
  const navigate = useNavigate();

  async function goTeacher() {
    const { data: user } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.user.id)
      .single();

    if (profile?.role !== "teacher") {
      alert("No permission");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div>
      <button onClick={() => navigate("/join")}>
        Join Game
      </button>

      <button onClick={goTeacher}>
        Teacher Dashboard
      </button>
    </div>
  );
}