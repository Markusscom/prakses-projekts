import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>{mode === "login" ? "Login" : "Sign Up"}</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleAuth}>
        {mode === "login" ? "Login" : "Create account"}
      </button>

      <p
        onClick={() =>
          setMode(mode === "login" ? "signup" : "login")
        }
        style={{ cursor: "pointer" }}
      >
        Switch to {mode === "login" ? "Sign Up" : "Login"}
      </p>
    </div>
  );
}