import React, { useEffect, useState } from "react";
import API from "../api";

function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/blog/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data.posts);
    } catch (error) {
      console.error("Error fetching all blogs:", error);
      alert("Failed to fetch blogs — only admins can access this page!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center"> All Blogs (Admin)</h2>

      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        blogs.map((blog) => (
          <div
            key={blog._id}
            className="border rounded p-4 mb-3 bg-gray-50 shadow-sm"
          >
            <h3 className="text-xl font-semibold">{blog.title}</h3>
            <p className="whitespace-pre-wrap text-gray-700 mt-2">
              {blog.content.slice(0, 400)}...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              By: {blog.author?.username || "Unknown"} ({blog.author?.email})
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default AllBlogs;
