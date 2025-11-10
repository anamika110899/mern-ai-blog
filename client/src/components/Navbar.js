import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.role === "admin");
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const authenticatedLinks = [
    { to: "/dashboard", label: "Dashboard", isAdmin: false, style: "hover:text-blue-400" },
    { to: "/generate", label: "Generate Blog", isAdmin: false, style: "hover:text-blue-400" },
    { to: "/admin", label: "Admin", isAdmin: true, style: "hover:text-yellow-300" },
    { to: "/all-blogs", label: "All Blogs", isAdmin: true, style: "hover:text-yellow-300" },
  ];

  const unauthenticatedLinks = [
    { to: "/login", label: "Login", style: "hover:text-blue-400 font-semibold" },
    { to: "/register", label: "Register", style: "hover:text-blue-400 font-semibold" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white py-4 px-4 shadow-md flex justify-between items-center z-50">
      {/* Left Logo Section */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-extrabold text-blue-400 hover:text-blue-300 transition duration-200"
        >
          AI Blog
        </Link>
      </div>

      {/* Right Menu Section */}
      <div className="flex items-center gap-4 sm:gap-6">
        {token ? (
          <>
            {authenticatedLinks.map((link) => {
              if (link.isAdmin && !isAdmin) return null;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${link.style} transition duration-200`}
                >
                  {link.label}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1.5 rounded-md hover:bg-red-600 transition duration-200 text-white font-semibold shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          unauthenticatedLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${link.style} transition duration-200`}
            >
              {link.label}
            </Link>
          ))
        )}
      </div>
    </nav>
  );
}

export default Navbar;
