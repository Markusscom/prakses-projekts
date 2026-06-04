import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Teacher Dashboard</h1>

            <button onClick={() => navigate("/create")}>
                Create Quiz
            </button>

            <button onClick={() => navigate("/teacher-live")}>
                Start Live Game
            </button>
        </div>
    );
}