import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Button from "../components/ui/Button";
import styles from "./Profile.module.css";

export default function Profile() {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

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
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Iestati profilu</h1>
        <p>Izvēlies savu lomu</p>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={styles.select}
        >
          <option value="student">Students</option>
          <option value="teacher">Skolotājs</option>
        </select>

        <div className={styles.buttons}>
          <Button onClick={saveProfile}>Saglabāt</Button>
          <Button variant="danger" onClick={handleLogout}>
            Izrakstīties
          </Button>
        </div>
      </div>
    </div>
  );
}