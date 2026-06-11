import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./Navbar.css";

export default function Navbar() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        async function fetchRole() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .maybeSingle();
                setRole(profile?.role);
            }
        }
        fetchRole();
    }, []);

    return (
        <nav className="navbar">
            <div className="logo">Quiz Platform</div>
            <div className="links">
                <Link to="/">Home</Link>
                {role === "teacher" && (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/create">Create Quiz</Link>
                    </>
                )}
                <Link to="/join">Join Quiz</Link>
            </div>
        </nav>
    );
}