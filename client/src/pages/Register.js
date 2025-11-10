import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5002/api/auth/register", {
        username,
        email,
        password,
      });
      alert(" Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#3a3b5a] to-[#24243e] animate-gradientMove">
      {/* Glass Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl text-white">
        <h1 className="text-3xl font-bold text-center mb-2">Create Your Account </h1>
        <p className="text-gray-300 text-center mb-8">
          Join our AI-powered blogging community
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username */}

          <label className="block text-sm font-semibold mb-2 text-white">
            Username
          </label>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-white"
              required
            />
          </div>


          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="flex flex-col space-y-2"></div>
            <input
              type="password"
              placeholder="•••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-300 text-white"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 font-semibold text-white hover:from-purple-700 hover:to-indigo-600 transition-all duration-300"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;