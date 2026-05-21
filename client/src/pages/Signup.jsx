import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password);
            navigate("/");
        } catch (err) {
            setError("Signup failed – email may already exist");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0E14]">
            <form onSubmit={handleSubmit} className="bg-[#151B23] p-8 rounded-xl shadow-lg w-full max-w-sm space-y-5 border border-[#FFFFFF0D]">
                <h1 className="text-3xl font-bold text-[#F1F5F9]">Create Account</h1>
                {error && <p className="text-[#F4A5A5] text-sm">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded bg-[#0B0E14] border border-[#FFFFFF0D] text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#7B8CDE]"
                    required
                />
                <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded bg-[#0B0E14] border border-[#FFFFFF0D] text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#7B8CDE]"
                    required
                />
                <button type="submit" className="w-full py-3 bg-[#7B8CDE] hover:bg-[#A78BFA] text-[#0B0E14] rounded-full font-semibold transition-all duration-300 hover:scale-105">
                    Sign Up
                </button>
                <p className="text-sm text-[#94A3B8] text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#7B8CDE] hover:underline">Log in</Link>
                </p>
            </form>
        </div>
    );
}