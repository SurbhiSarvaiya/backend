const jwt = require('jsonwebtoken');
/*
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 👇 NO DATABASE
            req.user = decoded;

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};*/
const protect = (req, res, next) => {
  console.log("🟢 PROTECT HIT", req.method, req.originalUrl);

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log("❌ NO TOKEN");
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🟢 DECODED:", decoded);
    req.user = decoded;
    next();
  } catch (e) {
    console.log("❌ TOKEN INVALID");
    return res.status(401).json({ message: "Token invalid" });
  }
};

/*
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
*/
const admin = (req, res, next) => {
  console.log("🔥 ADMIN MIDDLEWARE HIT");
  console.log("USER IN ADMIN:", req.user);

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(401).json({
      message: "Admin access only",
      user: req.user
    });
  }
};

module.exports = { protect, admin };
