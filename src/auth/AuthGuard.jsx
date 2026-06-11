import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function check() {
      const { data } = await supabase.auth.getUser();

      if (!active) return;

      setUser(data?.user ?? null);
      setLoading(false);
    }

    check();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading) return <h2>Loading...</h2>;

  if (!user) return null;

  return children;
}