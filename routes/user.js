const router = require("express").Router();
const { User } = require("../models");
const { signToken, authMiddleware } = require("../utils/auth");

// Register a new user
router.post("/", async (req, res) => {
  const { username, email, password, confirm_password } = req.body;

  if (!username || !email || !password || !confirm_password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const userData = await User.create({
      username,
      email,
      password,
    });

    const token = signToken(userData);
    res.status(200).json({ token, user: userData });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(400).json({ message: "Failed to register user.", error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData || !userData.checkPassword(req.body.password)) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password. Please try again." });
    }

    const token = signToken(userData);
    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(400).json({ message: "Login failed", error: err.message });
  }
});

// Logout (no real session, just clear token client-side)
router.post("/logout", (req, res) => {
  res.status(204).end();
});

module.exports = router;
