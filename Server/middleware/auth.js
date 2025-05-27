const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("Missing Authorization Header");
    return res.status(401).json({ message: "Access Denied" });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    console.log("Token not found in Authorization header");
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified Token Payload:", verified);
    req.user = verified;
    next();
  } catch (err) {
    console.log("JWT verification failed:", err.message);
    res.status(400).json({ message: "Invalid Token" });
  }
};


module.exports = auth;
