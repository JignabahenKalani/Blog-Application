const router = require("express").Router();

const postRoutes = require("./post");
const postTitleRoutes = require("./post_title");
const userRoutes = require("./user");

router.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

router.use("/api/posts", postRoutes);
router.use("/api/post_title", postTitleRoutes);
router.use("/api/users", userRoutes);

module.exports = router;
