import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Log from "./pages/Log";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import IdleTracker from "./components/IdleTracker";
import { ThemeProvider } from "./context/ThemeContext";
import GreetingToast from "./components/GreetingToast";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return children;
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <AuthProvider>
      <ThemeProvider>
        <IdleTracker />
        <GreetingToast />
        <BrowserRouter>
          {token && <Navbar />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/log" element={<ProtectedRoute><Log /></ProtectedRoute>} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;