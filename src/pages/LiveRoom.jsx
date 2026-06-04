import { useParams } from "react-router-dom";

export default function LiveRoom() {
    const { code } = useParams();

    return (
        <div>
            <h1>Live Room</h1>
            <p>Room Code: {code}</p>

            <h2>Waiting for teacher...</h2>
        </div>
    );
}