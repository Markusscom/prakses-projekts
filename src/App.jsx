import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Auth from "./pages/Auth";
import Start from "./pages/Start";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import Join from "./pages/Join";
import LiveRoom from "./pages/LiveRoom";
import PlayQuiz from "./pages/PlayQuiz";
import Profile from "./pages/Profile";

import AuthGuard from "./auth/AuthGuard";
import TeacherLive from "./pages/TeacherLive";
import Navbar from "./components/Navbar";

function Layout({ children }) {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login" && location.pathname !== "/profile";

  return (
    <>
      {showNavbar && <Navbar />}
      <main style={{ padding: "20px" }}>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
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
              path="/profile"
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              }
            />
            
            <Route
              path="/teacher-live"
              element={
                <AuthGuard>
                  <TeacherLive />
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
              path="/create"
              element={
                <AuthGuard>
                  <CreateQuiz />
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
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}