const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "yourSuperSecretKey";

const signToken = ({ id, email }) => {
  return jwt.sign({ data: { id, email } }, secret, { expiresIn: "2h" });
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1].trim();

  try {
    const { data } = jwt.verify(token, secret);
    req.user = data; 
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = { signToken, authMiddleware };
