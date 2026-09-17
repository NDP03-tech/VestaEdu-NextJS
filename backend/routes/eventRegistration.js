// routes/eventRegistration.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
  registerEvent,
  getAllEventRegistrations,
} = require("../controllers/eventRegistrationController");

// POST: Đăng ký sự kiện
router.post("/", registerEvent);

// GET: Lấy tất cả đăng ký sự kiện
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  getAllEventRegistrations,
);

module.exports = router;
