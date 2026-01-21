const jwt = require("jsonwebtoken");

// TEMP in-memory user store
const users = [];

exports.register = (req, res) => {
  const { mobile, password } = req.body;

  const exists = users.find(u => u.mobile === mobile);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({
    mobile,
    password,
    role: "user"
  });

  res.json({ message: "User registered successfully" });
};

exports.login = (req, res) => {
  const { mobile, password } = req.body;

  // ADMIN (hard-coded)
  if (mobile === "9999999999" && password === "admin123") {
    const token = jwt.sign(
      { mobile, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token, role: "admin" });
  }

  // NORMAL USER
  const user = users.find(
    u => u.mobile === mobile && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "invalid mobile and password" });
  }

  const token = jwt.sign(
    { mobile, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: "user" });
};
