import "reflect-metadata";
import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Sentry from "@sentry/node";
import {
  initializeTypeOrm,
  createTypeOrmRepositories,
} from "./infrastructure/typeorm-container";
import {
  createCrudControllers,
  createWorkflowControllers,
} from "./infrastructure/presentation/composition-root";
import {
  createCrudRouter,
  type CrudRouteOptions,
} from "./infrastructure/presentation/routes/crud.routes";
import { createPresentationRoutes } from "./infrastructure/presentation/routes";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./infrastructure/presentation/docs/swagger";
import { auditLogMiddleware } from "./middleware/auditLog";
import { validateRequest } from "./middleware/validateRequest";
import {
  CreateBlogSchema,
  UpdateBlogSchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  CreateCourseSchema,
  UpdateCourseSchema,
  CreateEventSchema,
  UpdateEventSchema,
  CreateCourseRegistrationSchema,
  CreateEventRegistrationSchema,
  CreateInstructorSchema,
  UpdateInstructorSchema,
  LoginSchema,
  RegisterSchema,
} from "./infrastructure/presentation/validation/schemas";
const authenticateToken: express.RequestHandler = require(
  path.join(__dirname, "..", "middleware", "authenticateToken"),
);
const authorizeRoles = (...roles: string[]): express.RequestHandler =>
  require(path.join(__dirname, "..", "middleware", "authorizeRoles"))(...roles);

const app = express();
const port = Number(process.env.PORT ?? 5000);

if (process.env.NODE_ENV === "production" && !process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET must be configured in production");
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV ?? "development",
  enabled: Boolean(process.env.SENTRY_DSN),
});

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5000"];

const contentWriteAccess: CrudRouteOptions = {
  createMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
  updateMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
  deleteMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
};

const adminWriteAccess: CrudRouteOptions = {
  createMiddleware: [authenticateToken, authorizeRoles("admin")],
  updateMiddleware: [authenticateToken, authorizeRoles("admin")],
  deleteMiddleware: [authenticateToken, authorizeRoles("admin")],
};

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      callback(null, allowedOrigins.includes(origin.replace(/\/$/, "")));
    },
    credentials: true,
  }),
);

app.get("/health", (_request: express.Request, response: express.Response) => {
  response
    .status(200)
    .json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(auditLogMiddleware);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function start(): Promise<void> {
  await initializeTypeOrm();
  const repositories = createTypeOrmRepositories();
  const controllers = createCrudControllers();
  const workflows = createWorkflowControllers();
  const selfOrStaff: express.RequestHandler = (request, response, next) => {
    const currentUser = (
      request as express.Request & {
        user?: { id?: number; role?: string };
      }
    ).user;
    const requestedUserId = Number(request.params.userId);
    if (
      currentUser?.role === "admin" ||
      currentUser?.role === "teacher" ||
      currentUser?.id === requestedUserId
    ) {
      next();
      return;
    }
    response
      .status(403)
      .json({ message: "You cannot access another user's data" });
  };

  app.use(
    "/api/blog",
    createCrudRouter(controllers.blog, {
      ...contentWriteAccess,
      createMiddleware: [
        ...(contentWriteAccess.createMiddleware ?? []),
        validateRequest({ body: CreateBlogSchema }),
      ],
      updateMiddleware: [
        ...(contentWriteAccess.updateMiddleware ?? []),
        validateRequest({ body: UpdateBlogSchema }),
      ],
    }),
  );
  app.get(
    "/api/categories/:categoryId/quizzes",
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      try {
        const categoryId = Array.isArray(request.params.categoryId)
          ? request.params.categoryId[0]
          : request.params.categoryId;
        const rows = await repositories.categories.getByCategory(
          categoryId ?? "",
        );
        response.json({ data: rows });
      } catch (error) {
        next(error);
      }
    },
  );
  app.use(
    "/api/categories",
    createCrudRouter(controllers.category, {
      ...contentWriteAccess,
      createPath: "/",
      createMiddleware: [
        ...(contentWriteAccess.createMiddleware ?? []),
        validateRequest({ body: CreateCategorySchema }),
      ],
      updateMiddleware: [
        ...(contentWriteAccess.updateMiddleware ?? []),
        validateRequest({ body: UpdateCategorySchema }),
      ],
      deleteMiddleware: [authenticateToken, authorizeRoles("admin")],
    }),
  );
  app.use(
    "/api/course",
    createCrudRouter(controllers.course, {
      ...contentWriteAccess,
      createMiddleware: [
        ...(contentWriteAccess.createMiddleware ?? []),
        validateRequest({ body: CreateCourseSchema }),
      ],
      updateMiddleware: [
        ...(contentWriteAccess.updateMiddleware ?? []),
        validateRequest({ body: UpdateCourseSchema }),
      ],
    }),
  );
  app.use(
    "/api/events",
    createCrudRouter(controllers.event, {
      ...contentWriteAccess,
      createMiddleware: [
        ...(contentWriteAccess.createMiddleware ?? []),
        validateRequest({ body: CreateEventSchema }),
      ],
      updateMiddleware: [
        ...(contentWriteAccess.updateMiddleware ?? []),
        validateRequest({ body: UpdateEventSchema }),
      ],
    }),
  );
  app.use(
    "/api/course-registrations",
    authenticateToken,
    authorizeRoles("admin", "teacher", "student"),
    createCrudRouter(controllers.courseRegistration, {
      createPath: "/",
      createMiddleware: [
        authenticateToken,
        authorizeRoles("admin", "teacher", "student"),
      ],
      readMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
      updateMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
      deleteMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
    }),
  );
  app.use(
    "/api/event-registrations",
    createCrudRouter(controllers.eventRegistration, {
      createPath: "/",
      readMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
      updateMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
      deleteMiddleware: [authenticateToken, authorizeRoles("admin", "teacher")],
    }),
  );
  app.use(
    "/api/instructors",
    createCrudRouter(controllers.instructor, {
      createPath: "/",
      ...adminWriteAccess,
      createMiddleware: [
        ...(adminWriteAccess.createMiddleware ?? []),
        validateRequest({ body: CreateInstructorSchema }),
      ],
      updateMiddleware: [
        ...(adminWriteAccess.updateMiddleware ?? []),
        validateRequest({ body: UpdateInstructorSchema }),
      ],
    }),
  );
  app.use(
    "/api/questions",
    authenticateToken,
    authorizeRoles("admin", "teacher"),
    createCrudRouter(controllers.question, {
      createPath: "/",
      ...contentWriteAccess,
    }),
  );
  app.use(
    "/api/quizzes",
    createCrudRouter(controllers.quiz, {
      createPath: "/",
      ...contentWriteAccess,
    }),
  );

  app.post("/api/login", validateRequest({ body: LoginSchema }), workflows.userController.login as never);
  app.post("/api/register", validateRequest({ body: RegisterSchema }), workflows.userController.register as never);
  app.post(
    "/api/create-admin",
    authenticateToken,
    authorizeRoles("admin"),
    workflows.userController.createAdmin as never,
  );
  app.get(
    "/api/users",
    authenticateToken,
    authorizeRoles("admin"),
    workflows.userController.getUsers as never,
  );
  app.post(
    "/api/users",
    authenticateToken,
    authorizeRoles("admin"),
    workflows.userController.addUser as never,
  );
  app.put(
    "/api/users/:id",
    authenticateToken,
    authorizeRoles("admin"),
    workflows.userController.updateUser as never,
  );
  app.delete(
    "/api/users/:id",
    authenticateToken,
    authorizeRoles("admin"),
    workflows.userController.deleteUser as never,
  );
  app.post("/api/refresh", workflows.userController.refresh as never);
  app.post("/api/logout", workflows.userController.logout as never);
  app.get("/api/me", authenticateToken, workflows.userController.me as never);
  app.get(
    "/api/:userId/quizzes",
    authenticateToken,
    selfOrStaff,
    workflows.userController.getQuizzesForUser as never,
  );

  app.use(
    "/api/classes",
    authenticateToken,
    authorizeRoles("admin", "teacher"),
  );
  app.post("/api/classes", workflows.classController.createClass as never);
  app.get("/api/classes", workflows.classController.getAllClasses as never);
  app.get(
    "/api/classes/:classId",
    workflows.classController.getClassById as never,
  );
  app.post(
    "/api/classes/:classId/add-user",
    workflows.classController.addUserToClass as never,
  );
  app.post(
    "/api/classes/:classId/add-quiz",
    workflows.classController.addQuizToClass as never,
  );
  app.get(
    "/api/classes/:classId/quizzes",
    workflows.classController.getQuizzesOfClass as never,
  );
  app.get(
    "/api/classes/:classId/students",
    workflows.classController.getStudentsInClass as never,
  );
  app.post(
    "/api/classes/:classId/students",
    workflows.classController.addStudentsToClass as never,
  );
  app.post(
    "/api/classes/move-students",
    workflows.classController.moveStudents as never,
  );
  app.delete(
    "/api/classes/:classId/students/:studentId",
    workflows.classController.removeStudentFromClass as never,
  );
  app.put(
    "/api/classes/:classId",
    workflows.classController.updateClass as never,
  );
  app.delete(
    "/api/classes/:classId",
    workflows.classController.deleteClass as never,
  );

  app.use("/api/results", authenticateToken);
  app.post(
    "/api/results/start/:quizId",
    workflows.resultController.startAttempt as never,
  );
  app.post(
    "/api/results/temp/:resultId",
    workflows.resultController.tempSave as never,
  );
  app.post(
    "/api/results/submit/:resultId",
    workflows.resultController.submitAttempt as never,
  );
  app.get(
    "/api/results/latest/:quizId",
    workflows.resultController.getLatestResult as never,
  );
  app.get(
    "/api/results/attempts/:quizId",
    workflows.resultController.getAllAttempts as never,
  );
  app.get(
    "/api/results/user/results-stats",
    workflows.resultController.getUserResultsStats as never,
  );
  app.get(
    "/api/results/quiz/:quizId/best-attempts",
    authorizeRoles("admin", "teacher"),
    workflows.resultController.getUsersBestAttemptsByQuiz as never,
  );
  app.get(
    "/api/results/user/:userId/quiz/:quizId/best-attempt",
    authorizeRoles("admin", "teacher"),
    workflows.resultController.getUserQuizBestAttempt as never,
  );
  app.get(
    "/api/results/user-summary/:userId",
    authorizeRoles("admin", "teacher"),
    workflows.resultController.getUserQuizSummaryByUserId as never,
  );
  app.get(
    "/api/results/best-attempts/:quizId",
    workflows.resultController.getBestAttemptsByQuiz as never,
  );
  app.get(
    "/api/results/user-best-attempts/:userId",
    authorizeRoles("admin", "teacher"),
    workflows.resultController.getBestAttemptsByUserId as never,
  );

  app.get(
    "/api/assigned-quizzes",
    authenticateToken,
    workflows.assignedQuizController.getAssignedQuizzes as never,
  );
  app.get(
    "/api/dashboard/stats",
    authenticateToken,
    authorizeRoles("admin", "teacher"),
    workflows.dashboardController.getDashboardStats as never,
  );

  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
  app.use(
    (
      error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction,
    ) => {
      Sentry.captureException(error);
      response.status(500).json({ message: "Internal server error" });
    },
  );

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log("Database: PostgreSQL via TypeORM");
  });
}

start().catch((error) => {
  Sentry.captureException(error);
  console.error("TypeORM startup failed:", error);
  process.exitCode = 1;
});

export default app;
