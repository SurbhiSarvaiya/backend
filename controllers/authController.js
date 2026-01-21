import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __dirname = new URL('.', import.meta.url).pathname;
const usersFile = path.join(__dirname, "../data/users.json");

const readUsers = () => {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile));
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// REGISTER
export const registerUser = async (req, res) => {
  const { mobile, password, role } = req.body;

  const users = readUsers();
  const userExists = users.find(u => u.mobile === mobile);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    mobile,
    password: hashedPassword,
    role: role || "student"
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: "User registered successfully" });
};

// LOGIN
export const loginUser = async (req, res) => {
  const { mobile, password } = req.body;

  const users = readUsers();
  const user = users.find(u => u.mobile === mobile);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "secret123",
    { expiresIn: "1d" }
  );

  res.json({
    id: user.id,
    mobile: user.mobile,
    role: user.role,
    token
  });
};
