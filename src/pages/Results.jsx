import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();

    const { score, total } = location.state || { score: 0, total: 0 };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Results</h1>

            <h2>
                {score} / {total}
            </h2>

            <button onClick={() => navigate("/play")}>
                Play Again
            </button>
        </div>
    );
}