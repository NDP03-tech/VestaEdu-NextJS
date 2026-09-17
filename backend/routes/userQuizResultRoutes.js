const express = require("express");
const router = express.Router();
const userQuizResultController = require("../controllers/userQuizResultController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// ========================================
// 🔐 GLOBAL AUTHENTICATION MIDDLEWARE
// Áp dụng cho TẤT CẢ routes bên dưới
// ========================================
router.use(authenticateToken);

// ========================================
// 📝 QUIZ ATTEMPT OPERATIONS
// ========================================

// Bắt đầu làm bài quiz
router.post("/start/:quizId", userQuizResultController.startAttempt);

// Lưu tạm thời câu trả lời (auto-save)
router.post("/temp/:resultId", userQuizResultController.tempSave);

// Nộp bài và chấm điểm
router.post("/submit/:resultId", userQuizResultController.submitAttempt);

// ========================================
// 📊 GET USER ATTEMPTS (Current User)
// ========================================

// Lấy attempt gần nhất của user hiện tại cho quiz cụ thể
router.get("/latest/:quizId", userQuizResultController.getLatestResult);

// Lấy toàn bộ attempts của user hiện tại cho quiz cụ thể
router.get("/attempts/:quizId", userQuizResultController.getAllAttempts);

// ========================================
// 🎯 SPECIFIC ROUTES
// ⚠️ QUAN TRỌNG: Các route có path cụ thể phải đặt TRƯỚC các route có params chung
// ========================================

// Lấy thống kê kết quả của user hiện tại (dashboard)
router.get("/user/results-stats", userQuizResultController.getUserResultsStats);

// Lấy best attempts của TẤT CẢ users cho 1 quiz (Admin/Teacher view)
router.get(
  "/quiz/:quizId/best-attempts",
  authorizeRoles("admin", "teacher"),
  userQuizResultController.getUsersBestAttemptsByQuiz,
);

// Lấy best attempt của 1 user cụ thể cho 1 quiz cụ thể (Chi tiết từng câu)
router.get(
  "/user/:userId/quiz/:quizId/best-attempt",
  authorizeRoles("admin", "teacher"),
  userQuizResultController.getUserQuizBestAttempt,
);

// Lấy tổng hợp kết quả của 1 user theo tất cả quizzes
router.get(
  "/user-summary/:userId",
  authorizeRoles("admin", "teacher"),
  userQuizResultController.getUserQuizSummaryByUserId,
);

// ========================================
// 🏆 BEST ATTEMPTS ROUTES
// ⚠️ Đặt SAU các route cụ thể để tránh conflict
// ========================================

// Lấy best attempt của USER HIỆN TẠI cho 1 quiz cụ thể
// 👉 Sử dụng bởi: AssignedQuizzes.jsx
router.get(
  "/best-attempts/:quizId",
  userQuizResultController.getBestAttemptsByQuiz,
);

// Lấy TẤT CẢ best attempts của 1 user cụ thể (qua tất cả quizzes)
// 👉 Khác với route trên: userId thay vì quizId
router.get(
  "/user-best-attempts/:userId",
  authorizeRoles("admin", "teacher"),
  userQuizResultController.getBestAttemptsByUserId,
);

module.exports = router;
