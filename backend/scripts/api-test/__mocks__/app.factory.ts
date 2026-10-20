/**
 * app.factory.ts
 * Builds a fully configured Express app using mocked repositories.
 * No real DB or TypeORM connection needed.
 */
import express, { type RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "crypto";

import { TEST_JWT_SECRET, MOCK_USER, MOCK_RESULT, makeMockRepo,
  MOCK_BLOG, MOCK_CATEGORY, MOCK_COURSE, MOCK_EVENT, MOCK_INSTRUCTOR,
  MOCK_QUIZ, MOCK_QUESTION, MOCK_CLASS, MOCK_COURSE_REG, MOCK_EVENT_REG }
  from "./db.mock";

import { CrudController } from "../../../infrastructure/presentation/controllers/crud.controller";
import { createCrudRouter } from "../../../infrastructure/presentation/routes/crud.routes";

import { CreateBlogUseCase, DeleteBlogUseCase, GetAllBlogsUseCase,
  GetBlogByIdUseCase, UpdateBlogUseCase } from "../../../applications/Blog Use-case";
import { CreateCategoryUseCase, DeleteCategoryUseCase, GetAllCategoriesUseCase,
  GetCategoryByIdUseCase, UpdateCategoryUseCase } from "../../../applications/Category Use-case";
import { CreateCourseUseCase, DeleteCourseUseCase, GetAllCoursesUseCase,
  GetCourseByIdUseCase, UpdateCourseUseCase } from "../../../applications/Course Use-case";
import { CreateEventUseCase, DeleteEventUseCase, GetAllEventsUseCase,
  GetEventByIdUseCase, UpdateEventUseCase } from "../../../applications/Event Use-case";
import { CreateInstructorUseCase, DeleteInstructorUseCase, GetAllInstructorsUseCase,
  GetInstructorByIdUseCase, UpdateInstructorUseCase } from "../../../applications/Instructor Use-case";
import { CreateQuizUseCase, DeleteQuizUseCase, GetAllQuizzesUseCase,
  GetQuizByIdUseCase, UpdateQuizUseCase } from "../../../applications/Quiz Use-case";
import { CreateQuestionUseCase, DeleteQuestionUseCase, GetAllQuestionsUseCase,
  GetQuestionByIdUseCase, UpdateQuestionUseCase } from "../../../applications/Question Use-case";
import { CreateCourseRegistrationUseCase, DeleteCourseRegistrationUseCase,
  GetAllCourseRegistrationsUseCase, GetCourseRegistrationByIdUseCase,
  UpdateCourseRegistrationUseCase } from "../../../applications/CourseRegistration Use-case";
import { CreateEventRegistrationUseCase, DeleteEventRegistrationUseCase,
  GetAllEventRegistrationsUseCase, GetEventRegistrationByIdUseCase,
  UpdateEventRegistrationUseCase } from "../../../applications/EventRegistration Use-case";

// ─── JWT helpers ──────────────────────────────────────────────────────────────
export function makeToken(role: "admin" | "teacher" | "student" = "admin"): string {
  return jwt.sign(
    { id: 1, email: `${role}@test.com`, role, firstName: role, lastName: "User" },
    TEST_JWT_SECRET,
    { expiresIn: "1h" }
  );
}

// ─── Middleware stubs ──────────────────────────────────────────────────────────
function buildAuthMiddleware(): RequestHandler {
  return (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();
    const token = authHeader.split(" ")[1];
    try {
      (req as unknown as { user: unknown }).user = jwt.verify(token, TEST_JWT_SECRET);
    } catch { /* invalid token — leave req.user undefined */ }
    next();
  };
}

function buildAuthorizeRoles(...roles: string[]): RequestHandler {
  return (req, res, next) => {
    const user = (req as unknown as { user?: { role?: string } }).user;
    if (!user || !roles.includes(user.role ?? "")) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền thực hiện thao tác này." });
    }
    next();
  };
}

// ─── Build app ────────────────────────────────────────────────────────────────
export function buildTestApp() {
  process.env.ACCESS_TOKEN_SECRET = TEST_JWT_SECRET;

  const authenticateToken = buildAuthMiddleware();
  const authorizeRoles = buildAuthorizeRoles;

  const contentWrite = {
    createMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
    updateMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
    deleteMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
  };
  const adminWrite = {
    createMiddleware: [authenticateToken, authorizeRoles("admin")],
    updateMiddleware: [authenticateToken, authorizeRoles("admin")],
    deleteMiddleware: [authenticateToken, authorizeRoles("admin")],
  };

  // Mock repos
  const blogRepo = makeMockRepo(MOCK_BLOG);
  const categoryRepo = makeMockRepo(MOCK_CATEGORY);
  const courseRepo = makeMockRepo(MOCK_COURSE);
  const eventRepo = makeMockRepo(MOCK_EVENT);
  const instructorRepo = makeMockRepo(MOCK_INSTRUCTOR);
  const quizRepo = makeMockRepo(MOCK_QUIZ);
  const questionRepo = makeMockRepo(MOCK_QUESTION);
  const courseRegRepo = makeMockRepo(MOCK_COURSE_REG);
  const eventRegRepo = makeMockRepo(MOCK_EVENT_REG);
  const classRepo = makeMockRepo(MOCK_CLASS);
  const userRepo = makeMockRepo(MOCK_USER);
  const resultRepo = makeMockRepo(MOCK_RESULT);
  const refreshTokenRepo = makeMockRepo(null);
  const attemptsRepo = makeMockRepo(null);
  const assignedQuizRepo = { getByUserId: jest.fn().mockResolvedValue([MOCK_QUIZ]) };
  const dashboardRepo = makeMockRepo(null);

  // CRUD controllers
  const blogCtrl = new CrudController({
    create: new CreateBlogUseCase(blogRepo as never),
    getAll: new GetAllBlogsUseCase(blogRepo as never),
    getById: new GetBlogByIdUseCase(blogRepo as never),
    update: new UpdateBlogUseCase(blogRepo as never),
    remove: new DeleteBlogUseCase(blogRepo as never),
  });
  const categoryCtrl = new CrudController({
    create: new CreateCategoryUseCase(categoryRepo as never),
    getAll: new GetAllCategoriesUseCase(categoryRepo as never),
    getById: new GetCategoryByIdUseCase(categoryRepo as never),
    update: new UpdateCategoryUseCase(categoryRepo as never),
    remove: new DeleteCategoryUseCase(categoryRepo as never),
  });
  const courseCtrl = new CrudController({
    create: new CreateCourseUseCase(courseRepo as never),
    getAll: new GetAllCoursesUseCase(courseRepo as never),
    getById: new GetCourseByIdUseCase(courseRepo as never),
    update: new UpdateCourseUseCase(courseRepo as never),
    remove: new DeleteCourseUseCase(courseRepo as never),
  });
  const eventCtrl = new CrudController({
    create: new CreateEventUseCase(eventRepo as never),
    getAll: new GetAllEventsUseCase(eventRepo as never),
    getById: new GetEventByIdUseCase(eventRepo as never),
    update: new UpdateEventUseCase(eventRepo as never),
    remove: new DeleteEventUseCase(eventRepo as never),
  });
  const instructorCtrl = new CrudController({
    create: new CreateInstructorUseCase(instructorRepo as never),
    getAll: new GetAllInstructorsUseCase(instructorRepo as never),
    getById: new GetInstructorByIdUseCase(instructorRepo as never),
    update: new UpdateInstructorUseCase(instructorRepo as never),
    remove: new DeleteInstructorUseCase(instructorRepo as never),
  });
  const quizCtrl = new CrudController({
    create: new CreateQuizUseCase(quizRepo as never),
    getAll: new GetAllQuizzesUseCase(quizRepo as never),
    getById: new GetQuizByIdUseCase(quizRepo as never),
    update: new UpdateQuizUseCase(quizRepo as never),
    remove: new DeleteQuizUseCase(quizRepo as never),
  });
  const questionCtrl = new CrudController({
    create: new CreateQuestionUseCase(questionRepo as never),
    getAll: new GetAllQuestionsUseCase(questionRepo as never),
    getById: new GetQuestionByIdUseCase(questionRepo as never),
    update: new UpdateQuestionUseCase(questionRepo as never),
    remove: new DeleteQuestionUseCase(questionRepo as never),
  });
  const courseRegCtrl = new CrudController({
    create: new CreateCourseRegistrationUseCase(courseRegRepo as never),
    getAll: new GetAllCourseRegistrationsUseCase(courseRegRepo as never),
    getById: new GetCourseRegistrationByIdUseCase(courseRegRepo as never),
    update: new UpdateCourseRegistrationUseCase(courseRegRepo as never),
    remove: new DeleteCourseRegistrationUseCase(courseRegRepo as never),
  });
  const eventRegCtrl = new CrudController({
    create: new CreateEventRegistrationUseCase(eventRegRepo as never),
    getAll: new GetAllEventRegistrationsUseCase(eventRegRepo as never),
    getById: new GetEventRegistrationByIdUseCase(eventRegRepo as never),
    update: new UpdateEventRegistrationUseCase(eventRegRepo as never),
    remove: new DeleteEventRegistrationUseCase(eventRegRepo as never),
  });

  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.status(200).json({ status: "OK" }));

  // CRUD routes
  app.use("/api/blog", createCrudRouter(blogCtrl, contentWrite));
  app.use("/api/categories", createCrudRouter(categoryCtrl, {
    ...contentWrite, createPath: "/",
    deleteMiddleware: [authenticateToken, authorizeRoles("admin")],
  }));
  app.use("/api/course", createCrudRouter(courseCtrl, contentWrite));
  app.use("/api/events", createCrudRouter(eventCtrl, contentWrite));
  app.use("/api/instructors", createCrudRouter(instructorCtrl, { createPath: "/", ...adminWrite }));
  app.use("/api/quizzes", createCrudRouter(quizCtrl, { createPath: "/", ...contentWrite }));
  app.use("/api/questions", authenticateToken, authorizeRoles("admin", "teacher"),
    createCrudRouter(questionCtrl, { createPath: "/", ...contentWrite }));
  app.use("/api/course-registrations", authenticateToken,
    authorizeRoles("admin", "teacher", "student"),
    createCrudRouter(courseRegCtrl, {
      createPath: "/",
      createMiddleware: [authenticateToken, authorizeRoles("admin", "teacher", "student")],
      readMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
      updateMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
      deleteMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
    }));
  app.use("/api/event-registrations", createCrudRouter(eventRegCtrl, {
    createPath: "/",
    readMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
    updateMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
    deleteMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
  }));

  // ─── User routes (inline mock) ──────────────────────────────────────────────
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body ?? {};
    if (email === "admin@test.com" && password === "Admin@1234") {
      const accessToken = jwt.sign(
        { id: 1, email, role: "admin", firstName: "Ad", lastName: "Min" },
        TEST_JWT_SECRET, { expiresIn: "15m" }
      );
      return res.status(200).json({ accessToken, refreshToken: "fake-refresh-token" });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  });

  app.post("/api/register", async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ message: "email and password required" });
    userRepo.create.mockResolvedValueOnce(MOCK_USER);
    return res.status(201).json({ message: "Registered successfully" });
  });

  app.post("/api/refresh", async (req, res) => {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) return res.status(400).json({ message: "refreshToken required" });
    const stored = await refreshTokenRepo.getActiveByHash();
    if (!stored) return res.status(401).json({ message: "Invalid or expired refresh token" });
    const accessToken = jwt.sign(
      { id: 1, email: "admin@test.com", role: "admin", firstName: "Ad", lastName: "Min" },
      TEST_JWT_SECRET, { expiresIn: "15m" }
    );
    return res.status(200).json({ accessToken });
  });

  app.post("/api/logout", async (_req, res) => {
    return res.status(200).json({ message: "Logged out" });
  });

  app.get("/api/me", authenticateToken, (req, res) => {
    const user = (req as unknown as { user?: unknown }).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    return res.status(200).json({ data: user });
  });

  app.post("/api/create-admin", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ message: "email and password required" });
    return res.status(201).json({ message: "Admin created" });
  });

  app.get("/api/users", authenticateToken, authorizeRoles("admin"), async (_req, res) => {
    return res.status(200).json({ data: [MOCK_USER.toJSON()] });
  });

  app.post("/api/users", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ message: "email and password required" });
    return res.status(201).json({ data: MOCK_USER.toJSON() });
  });

  app.put("/api/users/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    return res.status(200).json({ data: MOCK_USER.toJSON() });
  });

  app.delete("/api/users/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    return res.status(204).json(null);
  });

  // ─── Class routes (inline mock) ─────────────────────────────────────────────
  const classAuth = [authenticateToken, authorizeRoles("admin", "teacher")];
  app.use("/api/classes", ...classAuth);
  app.post("/api/classes", (req, res) => res.status(201).json({ data: MOCK_CLASS.toJSON() }));
  app.get("/api/classes", (_req, res) => res.status(200).json({ data: [MOCK_CLASS.toJSON()] }));
  app.get("/api/classes/:classId", (_req, res) => res.status(200).json({ data: MOCK_CLASS.toJSON() }));
  app.post("/api/classes/:classId/add-user", (_req, res) => res.status(200).json({ data: MOCK_CLASS.toJSON() }));
  app.post("/api/classes/:classId/add-quiz", (_req, res) => res.status(200).json({ data: MOCK_CLASS.toJSON() }));
  app.get("/api/classes/:classId/quizzes", (_req, res) => res.status(200).json({ data: [MOCK_QUIZ.toJSON()] }));
  app.get("/api/classes/:classId/students", (_req, res) => res.status(200).json({ data: [] }));
  app.post("/api/classes/:classId/students", (_req, res) => res.status(200).json({ data: MOCK_CLASS.toJSON() }));
  app.post("/api/classes/move-students", (_req, res) => res.status(200).json({ message: "moved" }));
  app.delete("/api/classes/:classId/students/:studentId", (_req, res) => res.status(204).json(null));
  app.put("/api/classes/:classId", (_req, res) => res.status(200).json({ data: MOCK_CLASS.toJSON() }));
  app.delete("/api/classes/:classId", (_req, res) => res.status(204).json(null));

  // ─── Quiz results routes ────────────────────────────────────────────────────
  app.use("/api/results", authenticateToken);
  app.post("/api/results/start/:quizId", (req, res) => res.status(201).json({ data: MOCK_RESULT.toJSON() }));
  app.post("/api/results/temp/:resultId", (req, res) => res.status(200).json({ data: MOCK_RESULT.toJSON() }));
  app.post("/api/results/submit/:resultId", (req, res) => res.status(200).json({ data: MOCK_RESULT.toJSON() }));
  app.get("/api/results/latest/:quizId", (req, res) => res.status(200).json({ data: MOCK_RESULT.toJSON() }));
  app.get("/api/results/attempts/:quizId", (req, res) => res.status(200).json({ data: [MOCK_RESULT.toJSON()] }));
  app.get("/api/results/user/results-stats", (req, res) => res.status(200).json({ data: { total: 1, passed: 1 } }));
  app.get("/api/results/quiz/:quizId/best-attempts", authorizeRoles("admin", "teacher"), (req, res) => res.status(200).json({ data: [] }));
  app.get("/api/results/user/:userId/quiz/:quizId/best-attempt", authorizeRoles("admin", "teacher"), (req, res) => res.status(200).json({ data: MOCK_RESULT.toJSON() }));
  app.get("/api/results/user-summary/:userId", authorizeRoles("admin", "teacher"), (req, res) => res.status(200).json({ data: [] }));
  app.get("/api/results/best-attempts/:quizId", (req, res) => res.status(200).json({ data: [] }));
  app.get("/api/results/user-best-attempts/:userId", authorizeRoles("admin", "teacher"), (req, res) => res.status(200).json({ data: [] }));

  // ─── Dashboard & assigned quizzes ──────────────────────────────────────────
  app.get("/api/assigned-quizzes", authenticateToken, (_req, res) => res.status(200).json({ data: [MOCK_QUIZ.toJSON()] }));
  app.get("/api/dashboard/stats", authenticateToken, authorizeRoles("admin", "teacher"), (_req, res) =>
    res.status(200).json({ data: { users: 10, courses: 5, quizzes: 3, events: 2 } }));

  // ─── Categories/quizzes (inline) ────────────────────────────────────────────
  app.get("/api/categories/:categoryId/quizzes", (_req, res) => res.status(200).json({ data: [MOCK_QUIZ.toJSON()] }));

  // ─── User quizzes ────────────────────────────────────────────────────────────
  app.get("/api/:userId/quizzes", authenticateToken, (_req, res) => res.status(200).json({ data: [MOCK_QUIZ.toJSON()] }));

  // ─── Error handler ────────────────────────────────────────────────────────────
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const msg = error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message: msg });
  });

  return { app, repos: { blogRepo, categoryRepo, courseRepo, eventRepo, instructorRepo, quizRepo, questionRepo, courseRegRepo, eventRegRepo, classRepo, userRepo, resultRepo, refreshTokenRepo } };
}

