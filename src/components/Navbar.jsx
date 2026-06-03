import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                Quiz Platform
            </div>

            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/create">Create</Link>
                <Link to="/join">Join</Link>
                <Link to="/play">Play</Link>
                <Link to="/results">Results</Link>
            </div>
        </nav>
    );
}