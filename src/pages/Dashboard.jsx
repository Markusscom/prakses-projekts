import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Teacher Dashboard</h1>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <Button onClick={() => navigate("/create")}>
                    Create Quiz
                </Button>

                <Button onClick={() => navigate("/teacher-live")}>
                    Start Live Game
                </Button>
            </div>
        </div>
    );
}