import React, { useEffect, useState } from "react";
import API from "../api";
import GenerateBlog from "./GenerateBlog";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Decode user role from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === "admin");
    }
  }, []);

  //  Fetch user’s blogs
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/blog/my-blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data.posts);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  //  Edit blog
  const handleEdit = (blog) => {
    setEditingBlog(blog._id);
    setEditTitle(blog.title);
    setEditContent(blog.content);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/blog/${editingBlog}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(" Blog updated successfully!");
      setEditingBlog(null);
      fetchBlogs();
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  //  Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(" Blog deleted successfully!");
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        My Blogs Dashboard
      </h2>

      {/* Generate New Blog Section */}
      <div className="card bg-base-200 shadow-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">✨ Generate New Blog</h3>
        <GenerateBlog onNewBlog={(newBlog) => setBlogs([newBlog, ...blogs])} />
      </div>

      {/* Blogs Section */}
      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">
          No blogs yet — generate your first one!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="card bg-base-100 shadow-lg p-5">
              {editingBlog === blog._id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input input-bordered w-full mb-3"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={6}
                    className="textarea textarea-bordered w-full mb-3"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="btn btn-success text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingBlog(null)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap mb-4">
                    {blog.content}
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="btn btn-warning btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="btn btn-error btn-sm text-white"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
