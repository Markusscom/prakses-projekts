import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    return (
        <div className="home">
            <h1>Quiz Platform</h1>

            <p>
                Veido interaktīvus uzdevumus vai pievienojies spēlei.
            </p>

            <div className="button-container">
                <Link to="/create">
                    <button>Create Quiz</button>
                </Link>

                <Link to="/join">
                    <button>Join Quiz</button>
                </Link>
            </div>
        </div>
    );
}