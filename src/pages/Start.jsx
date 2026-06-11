import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Button from "../components/ui/Button";

export default function Start() {
  const navigate = useNavigate();

  async function goTeacher() {
    const { data: { user } } = await supabase.auth.getUser();

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
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Sveicināts Quiz platformā!</h1>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
        <Button onClick={() => navigate("/join")}>
            Join Game
        </Button>

        <Button onClick={goTeacher}>
            Teacher Dashboard
        </Button>
      </div>
    </div>
  );
}