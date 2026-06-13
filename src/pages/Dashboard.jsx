import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>Teacher Dashboard</h1>

            <div className={styles.buttonGroup}>
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