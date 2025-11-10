import React, { useState } from "react";
import API from "../api";

function BlogEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSave = async (status) => {
    if (!title || !content) return alert("Please fill all fields!");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/blog",
        { title, content, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(
        status === "draft"
          ? "Draft saved successfully!"
          : "Blog submitted for review!"
      );
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error saving blog:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  //  AI Continue Writing
  const handleAIContinue = async () => {
    if (!content) return alert("Write something first!");
    setAiLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/blog/continue",
        { text: content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContent((prev) => prev + "\n\n" + res.data.continuation);
    } catch (err) {
      console.error("Error continuing with AI:", err);
      alert("AI could not generate continuation.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center"> AI Blog Editor</h2>

      <input
        type="text"
        placeholder="Enter blog title"
        className="border p-2 w-full rounded mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Write or paste your blog content..."
        className="border p-3 w-full rounded h-60 mb-3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleSave("draft")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          disabled={loading}
        >
          Save Draft
        </button>

        <button
          onClick={() => handleSave("pending")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Publish
        </button>

        <button
          onClick={handleAIContinue}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={aiLoading}
        >
          {aiLoading ? "✨ AI Writing..." : "✨ Continue with AI"}
        </button>
      </div>
    </div>
  );
}

export default BlogEditor;
