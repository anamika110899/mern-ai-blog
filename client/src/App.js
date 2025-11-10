import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GenerateBlog from "./pages/GenerateBlog";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/protectedRoute";
import Navbar from "./components/Navbar";
import AllBlogs from "./pages/AllBlogs";
import BlogEditor from "./pages/BlogEditor";
import AdminDashboard from "./pages/AdminDashboard";




function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {<Route path="/all-blogs" element={<AllBlogs />} />}
        <Route path="/editor" element={<BlogEditor />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/*  Protected routes */}
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <GenerateBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
