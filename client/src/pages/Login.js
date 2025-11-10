import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5002/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert(" Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(" Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl text-white">
        <h1 className="text-3xl font-bold text-center mb-3">Welcome Back </h1>
        <p className="text-gray-300 text-center mb-8">
          Login to your AI Blog account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <div className="flex flex-col space-y-2"></div>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-300 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="flex flex-col space-y-2"></div>
            <input
              type="password"
              placeholder="•••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-6 rounded-lg bg-white/10 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-300 text-white "
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 font-semibold text-white hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 "

          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
