import { Routes, Route, Link } from "react-router-dom";


import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";
import JoinQuiz from "./pages/JoinQuiz";
import PlayQuiz from "./pages/PlayQuiz";
import Results from "./pages/Results";

import { supabase } from "./lib/supabase";

async function test() {
  const { data, error } = await supabase.from("quizzes").select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

test();

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateQuiz />} />
                <Route path="/join" element={<JoinQuiz />} />
                <Route path="/play" element={<PlayQuiz />} />
                <Route path="/results" element={<Results />} />
            </Routes>
        </>
    );
}

export default App;