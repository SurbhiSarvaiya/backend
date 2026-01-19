import express from "express";

const router = express.Router();

/* TEST ROUTE (IMPORTANT) */
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working" });
});

/* LOGIN ROUTE */
router.post("/login", (req, res) => {
  const { mobile, password } = req.body;

  // TEMP RESPONSE (to test routing)
  res.json({
    message: "Login API hit",
    mobile,
  });
});

/* REGISTER ROUTE */
router.post("/register", (req, res) => {
  res.json({ message: "Register API hit" });
});

export default router;
