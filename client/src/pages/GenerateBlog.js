import React, { useState } from "react";
import API from "../api";

function GenerateBlog({ onNewBlog }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBlog(null);

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/blog/generate",
        { title },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newBlog = res.data.post;
      setBlog(newBlog);

      //  New blog instantly dashboard को भेज दो
      if (onNewBlog) onNewBlog(newBlog);

      alert(" Blog generated and saved successfully!");
      setTitle("");
    } catch (error) {
      console.error("Error generating blog:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">✨ Generate AI Blog</h2>
      <form onSubmit={handleGenerate} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter a blog title..."
          className="border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {blog && (
        <div className="border p-4 rounded bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
          <p className="whitespace-pre-wrap">{blog.content}</p>
        </div>
      )}
    </div>
  );
}

export default GenerateBlog;
