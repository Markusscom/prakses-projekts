import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Button from "../components/ui/Button";

export default function Profile() {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  async function saveProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("profiles")
      .insert([{ id: user.id, role }]);

    if (error) {
      alert("Kļūda saglabājot profilu: " + error.message);
    } else {
      navigate("/");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Iestati savu profilu</h1>
      <p>Izvēlies savu lomu:</p>
      <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: "10px", marginBottom: "20px" }}>
        <option value="student">Students</option>
        <option value="teacher">Skolotājs</option>
      </select>
      <br />
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <Button onClick={saveProfile}>Saglabāt</Button>
        <Button variant="danger" onClick={handleLogout}>Izrakstīties</Button>
      </div>
    </div>
  );
}