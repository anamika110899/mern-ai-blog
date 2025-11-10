import React, { useEffect, useState } from "react";
import API from "../api";

function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllBlogs = async () => {
    try {
      const res = await API.get("/blog/all");
      setBlogs(res.data.posts);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center"> All Approved Blogs</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No approved blogs found yet.</p>
      ) : (
        blogs.map((blog) => (
          <div
            key={blog._id}
            className="border rounded-lg p-5 mb-5 bg-white shadow hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold">{blog.title}</h3>
            <p className="text-gray-700 mt-2 whitespace-pre-wrap">{blog.content}</p>
            <p className="text-sm text-gray-500 mt-3">
              By {blog.author?.username || "Unknown"} •{" "}
              {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default AllBlogs;
