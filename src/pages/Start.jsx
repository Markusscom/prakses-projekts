import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Start() {
  const navigate = useNavigate();

    async function goTeacher() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        navigate("/login");
        return;
    }

    const user = data.user;

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        alert("Profile not found");
        return;
    }

    if (profile.role !== "teacher") {
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