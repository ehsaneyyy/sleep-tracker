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
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm space-y-5">
                <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500"
                    required
                />
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold transition">
                    Sign Up
                </button>
                <p className="text-sm text-gray-400 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-400 hover:underline">Log in</Link>
                </p>
            </form>
        </div>
    );
}


