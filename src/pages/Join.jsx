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
    if (!code || !nickname) {
      alert("Enter code and nickname");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    const userId = userData?.user?.id || null;

    const { error } = await supabase.from("players").insert({
      room_code: code,
      nickname: nickname,
      user_id: userId,
      score: 0,
      status: "active"
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate(`/live/${code}`);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Join</h1>

      <Input
        placeholder="Room code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <Input
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <Button onClick={joinRoom}>
        Join
      </Button>
    </div>
  );
}