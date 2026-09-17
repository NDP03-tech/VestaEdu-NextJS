const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// GET /api/dashboard/stats
router.get(
  "/stats",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  dashboardController.getDashboardStats,
);

module.exports = router;
