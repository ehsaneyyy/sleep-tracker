import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { IdleProvider } from "./context/IdleContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Log from "./pages/Log";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import IdleTracker from "./components/IdleTracker";
import GreetingToast from "./components/GreetingToast";
import InstallPrompt from "./components/InstallPrompt";
import LoginPrompt from "./components/LoginPrompt";

function App() {
  const token = localStorage.getItem("token");

  return (
    <AuthProvider>
      <IdleProvider>
        <ThemeProvider>
          <IdleTracker />
          <GreetingToast />
          <BrowserRouter>
            <LoginPrompt />
            <InstallPrompt />
            {token && <Navbar />}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/log" element={<Log />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </IdleProvider>
    </AuthProvider>
  );
}

export default App;