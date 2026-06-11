import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Pārbauda sākotnējo sesiju
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });

    // Klausās izmaiņas autentifikācijas statusā
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/login", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) return <h2>Loading...</h2>;

  if (!user) return null;

  return children;
}