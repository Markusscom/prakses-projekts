import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">Quiz Platform</div>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/create">Create Quiz</Link>
                <Link to="/join">Join Quiz</Link>
            </div>
        </nav>
    );
}