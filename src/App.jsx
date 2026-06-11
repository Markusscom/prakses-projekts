import { BrowserRouter, Routes, Route } from "react-router-dom";

import Start from "./pages/Start";
import Dashboard from "./pages/Dashboard";
import Join from "./pages/Join";
import LiveRoom from "./pages/LiveRoom";
import TeacherLive from "./pages/TeacherLive";
import CreateQuiz from "./pages/CreateQuiz";
import PlayQuiz from "./pages/PlayQuiz";
import Results from "./pages/Results";

export default function App() {
    return (
            <Routes>

                <Route path="/" element={<Start />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create" element={<CreateQuiz />} />
                <Route path="/teacher-live" element={<TeacherLive />} />
                <Route path="/join" element={<Join />} />
                <Route path="/live/:code" element={<LiveRoom />} />
                <Route path="/play/:code" element={<PlayQuiz />} />
                <Route path="/results/:code" element={<Results />} />

            </Routes>
    );
}