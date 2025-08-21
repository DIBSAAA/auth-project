const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const app = express();
let PORT = 5000;
const JWT_SECRET_KEY = process.env.JWT_KEY;

app.use(bodyParser.json());

/// In-memory “database” (for demo only)
const users = [];

/// Generating JWT for user payload

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
}

/// Middleware to protect routes by verifying JWT.

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token required" });

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    console.log(user, JWT_SECRET_KEY);
    if (err) return err.status(403).json({ error: "Invalid or expired Token" });
    req.user = user;
    next();
  });
}

/// Registration endpoint.

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, password: hashedPassword };
  users.push(newUser);
  res.status(201).json({ message: "User registered" });
});

/**
 * Login endpoint.
 */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = generateToken(user);
  res.json({ token });
});

/**
 * Protected route example.
 */
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "Profile data", user: req.user });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
