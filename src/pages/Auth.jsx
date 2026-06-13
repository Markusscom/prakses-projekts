import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import styles from "./Auth.module.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  async function handleAuth() {
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Account created. Now login.");
      setMode("login");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  }

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.title}>{mode === "login" ? "Login" : "Sign Up"}</h1>

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={handleAuth}>
        {mode === "login" ? "Login" : "Create account"}
      </Button>

      <p
        className={styles.switchMode}
        onClick={() =>
          setMode(mode === "login" ? "signup" : "login")
        }
      >
        Switch to {mode === "login" ? "Sign Up" : "Login"}
      </p>
    </div>
  );
}
