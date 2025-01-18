const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.header("Authorization") || req.header("x-auth-token") || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { protect };
