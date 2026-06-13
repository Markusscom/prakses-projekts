import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import styles from "./Join.module.css";

export default function Join() {
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  async function joinRoom() {
    const { data: user } = await supabase.auth.getUser();

    await supabase.from("players").insert({
      room_code: code,
      user_id: user.user.id,
      score: 0,
      status: "active"
    });

    navigate(`/live/${code}`);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Join</h1>

      <Input
        placeholder="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <Input
        placeholder="Nickname (optional now)"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <Button onClick={joinRoom}>
        Join
      </Button>
    </div>
  );
}
