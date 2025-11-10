import React, { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/blog/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data.posts);
    } catch (err) {
      console.error("Error fetching pending blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");
    await API.put(`/blog/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
    alert(" Blog approved!");
    fetchPendingBlogs();
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");
    await API.put(`/blog/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });
    alert(" Blog rejected!");
    fetchPendingBlogs();
  };

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-center"> Admin Dashboard</h2>

      {loading ? (
        <p>Loading pending blogs...</p>
      ) : blogs.length === 0 ? (
        <p>No pending blogs right now </p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="border rounded p-4 mb-3 bg-gray-50">
            <h3 className="text-xl font-semibold">{blog.title}</h3>
            <p className="whitespace-pre-wrap text-gray-700 mt-2">{blog.content}</p>
            <p className="text-sm text-gray-500 mt-2">
               By {blog.author?.username} ({blog.author?.email})
            </p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleApprove(blog._id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                 Approve
              </button>
              <button
                onClick={() => handleReject(blog._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                 Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
