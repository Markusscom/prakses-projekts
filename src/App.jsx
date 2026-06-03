import { BrowserRouter, Routes, Route } from "react-router-dom";

import Start from "./pages/Start";
import Dashboard from "./pages/Dashboard";
import Join from "./pages/Join";
import CreateQuiz from "./pages/CreateQuiz";
import PlayQuiz from "./pages/PlayQuiz";
import Results from "./pages/Results";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Start />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create" element={<CreateQuiz />} />
                <Route path="/join" element={<Join />} />
                <Route path="/play/:id" element={<PlayQuiz />} />
                <Route path="/results" element={<Results />} />

            </Routes>
        </BrowserRouter>
    );
}