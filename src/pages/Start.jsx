import { useNavigate } from "react-router-dom";
import { setRole } from "../utils/role";

export default function Start() {
    const navigate = useNavigate();

    function chooseTeacher() {
        setRole("teacher");
        navigate("/dashboard");
    }

    function chooseStudent() {
        setRole("student");
        navigate("/join");
    }

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>Choose Role</h1>

            <button onClick={chooseTeacher}>
                I am Teacher
            </button>

            <button onClick={chooseStudent}>
                I am Student
            </button>
        </div>
    );
}