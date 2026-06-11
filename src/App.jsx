import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import Start from "./pages/Start";
import Dashboard from "./pages/Dashboard";
import Join from "./pages/Join";
import LiveRoom from "./pages/LiveRoom";
import PlayQuiz from "./pages/PlayQuiz";

import AuthGuard from "./auth/AuthGuard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Auth />} />

        <Route
          path="/"
          element={
            <AuthGuard>
              <Start />
            </AuthGuard>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />

        <Route
          path="/join"
          element={
            <AuthGuard>
              <Join />
            </AuthGuard>
          }
        />

        <Route
          path="/live/:code"
          element={
            <AuthGuard>
              <LiveRoom />
            </AuthGuard>
          }
        />

        <Route
          path="/play/:code"
          element={
            <AuthGuard>
              <PlayQuiz />
            </AuthGuard>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}