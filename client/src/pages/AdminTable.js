import React from "react";

function AdminTable({ blogs, onDelete }) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">🧑‍💼 Admin Dashboard</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Author</th>
            <th className="p-2 border">Created At</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} className="border-b">
              <td className="p-2 border">{blog.title}</td>
              <td className="p-2 border">{blog.author?.username || "Unknown"}</td>
              <td className="p-2 border">
                {new Date(blog.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => onDelete(blog._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
