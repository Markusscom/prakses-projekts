import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
    const { profile } = useAuth();
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo">
                    Quizzard
                </Link>
            </div>

            <div className="navbar-right">
                <Link
                    to="/"
                    className={location.pathname === "/" ? "active" : ""}
                >
                    Home
                </Link>

                <Link
                    to="/join"
                    className={location.pathname === "/join" ? "active" : ""}
                >
                    Join
                </Link>

                {profile?.role === "teacher" && (
                    <>
                        <Link
                            to="/dashboard"
                            className={location.pathname === "/dashboard" ? "active" : ""}
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/create"
                            className={location.pathname === "/create" ? "active" : ""}
                        >
                            Create
                        </Link>
                    </>
                )}

                <Link
                    to="/profile"
                    className={location.pathname === "/profile" ? "active" : ""}
                >
                    Profile
                </Link>
            </div>
        </nav>
    );
}