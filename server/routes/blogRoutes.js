const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const dotenv = require("dotenv");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");


dotenv.config();
const router = express.Router();

//  Generate Blog (Login required)
router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    console.log(" Request received for:", title);

    const model = "gemini-2.0-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `Write a detailed blog post on: ${title}. Include intro, key points, and conclusion.` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No content generated.";

    //  Save to MongoDB with logged-in user
    const newPost = new Post({
      title,
      content,
      author: req.user.id,
      status: "pending", // waiting for admin approval
    });
    await newPost.save();

    console.log(" Blog saved for user:", req.user.id);
    res.status(200).json({ message: "Blog generated successfully", post: newPost });
  } catch (error) {
    console.error(" Error generating blog:", error);
    res.status(500).json({ message: "Error generating blog", error: error.message });
  }
});

//  Get blogs of logged-in user (secure)
router.get("/my-blogs", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    console.error(" Error fetching blogs:", error);
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
});

//  Update Blog
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { title, content },
      { new: true }
    );

    if (!updatedPost)
      return res.status(404).json({ message: "Blog not found or not authorized" });

    res.status(200).json({ message: "Updated successfully", updatedPost });
  } catch (error) {
    console.error(" Error updating blog:", error);
    res.status(500).json({ message: "Error updating blog", error: error.message });
  }
});

//  Delete Blog
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!deleted)
      return res.status(404).json({ message: "Blog not found or not authorized" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(" Error deleting blog:", error);
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
});
//  Get all blogs (Admin only)
router.get("/all", authMiddleware, verifyRole(["admin"]), async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    console.error(" Error fetching all blogs:", error);
    res.status(500).json({ message: "Error fetching all blogs", error: error.message });
  }
});
//  Get all blogs (Admin only)
router.get("/all", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const posts = await Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    console.error(" Error fetching all blogs:", error);
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
});
//  Get all pending blogs (Admin only)
router.get("/pending", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });

  try {
    const pendingPosts = await Post.find({ status: "pending" }).populate("author", "username email");
    res.status(200).json({ posts: pendingPosts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending blogs", error: error.message });
  }
});

//  Approve / Reject Blog
router.patch("/:id/status", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });

  const { status } = req.body;
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ message: `Blog ${status} successfully`, updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
});
//  Get all approved blogs (Public route)
router.get("/all", async (req, res) => {
  try {
    const approvedPosts = await Post.find({ status: "approved" })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ posts: approvedPosts });
  } catch (error) {
    console.error(" Error fetching approved blogs:", error);
    res.status(500).json({ message: "Error fetching approved blogs", error: error.message });
  }
});
//  Create Blog (Manual, not AI)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, status } = req.body;
    if (!title || !content)
      return res.status(400).json({ message: "Title and content are required" });

    const newPost = new Post({
      title,
      content,
      status: status || "draft",
      author: req.user.id,
    });
    await newPost.save();

    res.status(201).json({ message: "Blog saved successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Error saving blog", error: error.message });
  }
});

//  Publish Draft
router.put("/publish/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { status: "pending" }, // admin review ke liye
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog submitted for review", post });
  } catch (error) {
    res.status(500).json({ message: "Error publishing blog", error: error.message });
  }
});
//  Continue Writing (AI helps user continue their blog)
router.post("/continue", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const model = "gemini-2.0-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Continue this blog in the same writing style:\n\n${text}\n\nContinue below:`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const continuation =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No continuation generated.";

    res.status(200).json({
      message: "AI continuation generated successfully",
      continuation,
    });
  } catch (error) {
    console.error(" Error generating continuation:", error);
    res.status(500).json({
      message: "Error generating continuation",
      error: error.message,
    });
    //  Get all blogs (Admin only)
    router.get("/all", authMiddleware, async (req, res) => {
      try {
        //  Check if user is admin
        if (req.user.role !== "admin") {
          return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const posts = await Post.find().populate("author", "username email").sort({ createdAt: -1 });
        res.status(200).json({ posts });
      } catch (error) {
        console.error(" Error fetching all blogs:", error);
        res.status(500).json({ message: "Error fetching all blogs", error: error.message });
      }
    });
    // 🧑‍💼 Admin — Get all blogs (only for admin)
    router.get("/all", authMiddleware, async (req, res) => {
      try {
        // Check if the logged-in user is admin
        if (req.user.role !== "admin") {
          return res.status(403).json({ message: "Access denied: Admins only" });
        }

        const posts = await Post.find()
          .populate("author", "username email role") // shows author info
          .sort({ createdAt: -1 });

        res.status(200).json({ posts });
      } catch (error) {
        console.error(" Error fetching all blogs:", error);
        res.status(500).json({ message: "Error fetching all blogs", error: error.message });
      }
    });
    // 🧑‍💼 Admin — Delete any blog
    router.delete("/admin/:id", authMiddleware, async (req, res) => {
      try {
        //  Check if user is admin
        if (req.user.role !== "admin") {
          return res.status(403).json({ message: "Access denied: Admins only" });
        }

        const deleted = await Post.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Blog not found" });

        res.status(200).json({ message: "Blog deleted successfully (Admin)" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error: error.message });
      }
    });


    //  Admin — Update any blog
    router.put("/admin/:id", authMiddleware, async (req, res) => {
      try {
        if (req.user.role !== "admin") {
          return res.status(403).json({ message: "Access denied: Admins only" });
        }

        const { title, content } = req.body;
        const updated = await Post.findByIdAndUpdate(
          req.params.id,
          { title, content },
          { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Blog not found" });

        res.status(200).json({ message: "Blog updated successfully", updated });
      } catch (error) {
        res.status(500).json({ message: "Error updating blog", error: error.message });
      }
    });
    //  Get all blogs (Admin only)
    router.get("/all", authMiddleware, async (req, res) => {
      try {
        //  Check if logged-in user is admin
        if (req.user.role !== "admin") {
          return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const posts = await Post.find()
          .populate("author", "username email") // author details भी दिखेंगे
          .sort({ createdAt: -1 });

        res.status(200).json({ posts });
      } catch (error) {
        console.error(" Error fetching all blogs:", error);
        res.status(500).json({ message: "Error fetching all blogs", error: error.message });
      }
    });


  }
});






module.exports = router;
