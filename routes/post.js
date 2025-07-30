const router = require("express").Router();
const { Post, User } = require("../models");
const { authMiddleware } = require("../utils/auth");

// GET all posts (newest first)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["createdOn", "DESC"]],
      include: [{ model: User, attributes: ["username"] }],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["username"] }],
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    console.error("GET /api/posts/:id error:", error);
    res.status(500).json({ error: "Failed to retrieve post" });
  }
});

// CREATE a new post (auth required)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newPost = await Post.create({
      title,
      content,
      postedBy: user.username,
      userId: user.id,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("POST /api/posts error:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// UPDATE 
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, content } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check ownership
    if (post.userId !== userId) {
      return res.status(403).json({ error: "You are not authorized to update this post" });
    }

    // Update fields
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("PUT /api/posts/:id error:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE 
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check ownership
    if (post.userId !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this post" });
    }

    await post.destroy();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/posts/:id error:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;
