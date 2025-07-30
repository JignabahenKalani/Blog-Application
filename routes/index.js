const router = require("express").Router();

const postRoutes = require("./post");
const titleRoutes = require("./title");
const userRoutes = require("./user");

// create a default route for /api
router.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

router.use("/api/title", titleRoutes);
router.use("/api/posts", postRoutes);
router.use("/api/users", userRoutes);

module.exports = router;
