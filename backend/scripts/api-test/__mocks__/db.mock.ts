/**
 * db.mock.ts
 * Shared in-memory mock repositories that simulate real DB responses.
 * All repositories follow the same interface pattern as TypeORM repositories.
 */

// ─── Shared IDs for cross-module references ───────────────────────────────────
export const MOCK_IDS = {
  blog: "1",
  category: "1",
  course: "1",
  event: "1",
  instructor: "1",
  quiz: "1",
  question: "1",
  class: "1",
  user: "1",
  courseReg: "1",
  eventReg: "1",
  result: "abc-result-uuid",
};

// ─── Mock token secrets ───────────────────────────────────────────────────────
export const TEST_JWT_SECRET = "test-super-secret-jwt-key-32chars!";
export const TEST_ACCESS_TOKEN_SECRET = TEST_JWT_SECRET;

// ─── Minimal entity stubs ─────────────────────────────────────────────────────
// These have .toJSON() so the CrudController serializer works.
function entity(fields: Record<string, unknown>) {
  return { ...fields, toJSON: () => fields };
}

export const MOCK_BLOG = entity({
  id: 1, title: "Test Blog", author: "Admin", authorImg: "/a.jpg",
  bannerImg: "/b.jpg", image: "/i.jpg", content: "Hello", createdAt: new Date(), updatedAt: new Date(),
});

export const MOCK_CATEGORY = entity({
  id: 1, name: "English", createdAt: new Date(), updatedAt: new Date(),
});

export const MOCK_COURSE = entity({
  id: 1, name: "IELTS", title: "IELTS Prep", author: "John", authorImg: null,
  image: "/i.jpg", bannerImg: null, lesson: "30", price: "free", duration: "3 months",
  type: "online", language: "vi", content: "...", dis: "...", schedule: [],
  createdAt: new Date(), updatedAt: new Date(),
});

export const MOCK_EVENT = entity({
  id: 1, title: "Seminar A", image: "/i.jpg", bannerImg: "/b.jpg", date: "2026-12-01",
  startTime: "09:00", category: "English", location: "HCM", cost: "free",
  host: "VestaEdu", content: "...", phone: "0900000000",
  createdAt: new Date(), updatedAt: new Date(),
});

export const MOCK_INSTRUCTOR = entity({
  id: 1, name: "Jane Doe", designation: "Senior Tutor", bio: null, image: "/j.jpg",
  facebook: null, twitter: null, linkedin: null, email: null, phone: null,
  status: "active", createdAt: new Date(), updatedAt: new Date(),
});

export const MOCK_QUIZ = entity({
  id: 1, title: "Quiz 1", category: "English", visibleTo: "everyone",
  uiSettings: { oneQuestionPerPage: false, showQuestionNumbers: true, shuffle: "none",
    timeLimit: 0, maxAttempts: "Unlimited", showFeedback: true, displayScore: true,
    specialChars: "", headerText: "", instructionText: "", quizCompleteMessage: "",
    showHeaderInput: false, showCompletionInput: false, showInstructionInput: false },
  passingScore: 90, createdAt: new Date(), updatedAt: new Date(),
});

export const MOCK_QUESTION = entity({
  id: 1, quizId: 1, type: "multiple-choice", questionText: "What is 2+2?",
  options: ["2","3","4","5"], correctAnswer: "4", order: 1,
  createdAt: new Date(), updatedAt: new Date(),
});

export const MOCK_CLASS = entity({
  id: 1, name: "Class A", description: "Beginner English", teacherId: null,
  studentIds: [], createdAt: new Date(), updatedAt: new Date(),
});

export const MOCK_USER = entity({
  id: 1, email: "admin@test.com", role: "admin", firstName: "Ad", lastName: "Min",
  passwordHash: "$2b$10$fakehash", createdAt: new Date(), updatedAt: new Date(),
  toPublicJSON: () => ({ id: 1, email: "admin@test.com", role: "admin", firstName: "Ad", lastName: "Min" }),
  verifyPassword: async () => true,
  updateProfile: () => {},
  changeEmail: () => {},
  changeRole: () => {},
});

export const MOCK_COURSE_REG = entity({
  id: 1, name: "Nguyen Van A", email: "a@test.com", phone: "0900000001",
  courseId: 1, courseTitle: "IELTS", createdAt: new Date(), updatedAt: new Date(),
});

export const MOCK_EVENT_REG = entity({
  id: 1, name: "Nguyen Van B", email: "b@test.com", phone: "0900000002",
  eventId: 1, eventTitle: "Seminar A", createdAt: new Date(), updatedAt: new Date(),
});

export const MOCK_RESULT = entity({
  id: "abc-result-uuid", userId: 1, quizId: 1, status: "in_progress",
  answers: [], score: null, createdAt: new Date(), updatedAt: new Date(),
});

// ─── Mock repository factories ────────────────────────────────────────────────
export function makeMockRepo(mockItem: unknown) {
  return {
    create: jest.fn().mockResolvedValue(mockItem),
    getAll: jest.fn().mockResolvedValue([mockItem]),
    getById: jest.fn().mockResolvedValue(mockItem),
    update: jest.fn().mockResolvedValue(mockItem),
    delete: jest.fn().mockResolvedValue(undefined),
    getByCategory: jest.fn().mockResolvedValue([mockItem]),
    getByQuizId: jest.fn().mockResolvedValue([mockItem]),
    getActive: jest.fn().mockResolvedValue([mockItem]),
    getActiveByHash: jest.fn().mockResolvedValue({
      userId: 1, tokenHash: "hash", expiresAt: new Date(Date.now() + 999999),
      toJSON: () => ({}),
    }),
    revokeByHash: jest.fn().mockResolvedValue(undefined),
    getBest: jest.fn().mockResolvedValue(mockItem),
    getByUserId: jest.fn().mockResolvedValue([mockItem]),
    getLatest: jest.fn().mockResolvedValue(mockItem),
    countActive: jest.fn().mockResolvedValue(5),
    save: jest.fn().mockResolvedValue(mockItem),
    // Class-specific
    addStudents: jest.fn().mockResolvedValue(mockItem),
    removeStudent: jest.fn().mockResolvedValue(mockItem),
    addQuiz: jest.fn().mockResolvedValue(mockItem),
    getStudents: jest.fn().mockResolvedValue([MOCK_USER]),
    getQuizzes: jest.fn().mockResolvedValue([MOCK_QUIZ]),
    moveStudents: jest.fn().mockResolvedValue(undefined),
    // Dashboard
    getUserCount: jest.fn().mockResolvedValue(10),
    getCourseCount: jest.fn().mockResolvedValue(5),
    getQuizCount: jest.fn().mockResolvedValue(3),
    getEventCount: jest.fn().mockResolvedValue(2),
  };
}

