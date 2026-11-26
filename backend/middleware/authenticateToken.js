const jwt = require("jsonwebtoken");

const { ACCESS_COOKIE, getCookie } = require("../utils/authCookies");

require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  let headerToken = null;

  if (authHeader) {
    const parts = authHeader.split(" ");

    if (parts.length === 2 && parts[0] === "Bearer") {
      const candidate = parts[1].replace(/"/g, "").trim();

      if (candidate && candidate !== "null" && candidate !== "undefined") {
        headerToken = candidate;
      }
    }
  }

  const cookieToken = getCookie(req, ACCESS_COOKIE);

  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({
      message: "Token không được cung cấp.",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Token không hợp lệ.",
      });
    }

    req.user = decoded;

    next();
  });
};

module.exports = authenticateToken;
