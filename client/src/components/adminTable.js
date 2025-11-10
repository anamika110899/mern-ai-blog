import React, { useState } from "react";

function AdminTable({ blogs, onDelete, onStatusChange }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const itemsPerPage = 5;

  // ✅ Search + Sort Logic
  const filtered = blogs
    .filter(
      (b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author?.username?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === "title" || sortKey === "author") {
        const aVal = sortKey === "title" ? a.title : a.author?.username;
        const bVal = sortKey === "title" ? b.title : b.author?.username;
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // ✅ Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-3">All Blogs Overview</h3>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search by title or author..."
        className="border p-2 w-full mb-3 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📊 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th
                onClick={() => handleSort("title")}
                className="px-4 py-2 border cursor-pointer"
              >
                Title {sortKey === "title" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("author")}
                className="px-4 py-2 border cursor-pointer"
              >
                Author {sortKey === "author" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("createdAt")}
                className="px-4 py-2 border cursor-pointer"
              >
                Date {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2 border text-center">Status</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-3 text-gray-500">
                  No matching blogs found.
                </td>
              </tr>
            ) : (
              paginated.map((blog) => (
                <tr key={blog._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{blog.title}</td>
                  <td className="px-4 py-2">
                    {blog.author?.username || "Unknown"}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>

                  {/* 🏷️ Status */}
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        blog.status === "approved"
                          ? "bg-green-500"
                          : blog.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>

                  {/* 🧩 Actions */}
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    {blog.status === "pending" && (
                      <>
                        <button
                          onClick={() => onStatusChange(blog._id, "approved")}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onStatusChange(blog._id, "rejected")}
                          className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDelete(blog._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-center mt-4 gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* 🪟 View Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-3">{selectedBlog.title}</h2>
            <p className="text-gray-600 mb-4">
              By {selectedBlog.author?.username || "Unknown"} —{" "}
              {new Date(selectedBlog.createdAt).toLocaleString()}
            </p>
            <p className="whitespace-pre-wrap">{selectedBlog.content}</p>
            <div className="text-right mt-4">
              <button
                onClick={() => setSelectedBlog(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTable;
