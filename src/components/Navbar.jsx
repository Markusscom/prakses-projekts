import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
    const { profile } = useAuth();

    return (
        <nav className="navbar">
            <div className="logo">Quiz Platform</div>
            <div className="links">
                <Link to="/">Home</Link>
                {profile?.role === "teacher" && (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/create">Create Quiz</Link>
                    </>
                )}
                <Link to="/join">Join Quiz</Link>
                <Link to="/profile">Profile</Link>
            </div>
        </nav>
    );
}