import {
  CreateBlogUseCase,
  DeleteBlogUseCase,
  GetAllBlogsUseCase,
  GetBlogByIdUseCase,
  UpdateBlogUseCase,
} from "../../applications/Blog Use-case";
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetAllCategoriesUseCase,
  GetCategoryByIdUseCase,
  UpdateCategoryUseCase,
} from "../../applications/Category Use-case";
import {
  CreateCourseUseCase,
  DeleteCourseUseCase,
  GetAllCoursesUseCase,
  GetCourseByIdUseCase,
  UpdateCourseUseCase,
} from "../../applications/Course Use-case";
import {
  CreateCourseRegistrationUseCase,
  DeleteCourseRegistrationUseCase,
  GetAllCourseRegistrationsUseCase,
  GetCourseRegistrationByIdUseCase,
  UpdateCourseRegistrationUseCase,
} from "../../applications/CourseRegistration Use-case";
import {
  CreateEventUseCase,
  DeleteEventUseCase,
  GetAllEventsUseCase,
  GetEventByIdUseCase,
  UpdateEventUseCase,
} from "../../applications/Event Use-case";
import {
  CreateEventRegistrationUseCase,
  DeleteEventRegistrationUseCase,
  GetAllEventRegistrationsUseCase,
  GetEventRegistrationByIdUseCase,
  UpdateEventRegistrationUseCase,
} from "../../applications/EventRegistration Use-case";
import {
  CreateInstructorUseCase,
  DeleteInstructorUseCase,
  GetAllInstructorsUseCase,
  GetInstructorByIdUseCase,
  UpdateInstructorUseCase,
} from "../../applications/Instructor Use-case";
import {
  CreateQuestionUseCase,
  DeleteQuestionUseCase,
  GetAllQuestionsUseCase,
  GetQuestionByIdUseCase,
  GetQuestionsByQuizIdUseCase,
  UpdateQuestionUseCase,
} from "../../applications/Question Use-case";
import {
  CreateQuizUseCase,
  DeleteQuizUseCase,
  GetAllQuizzesUseCase,
  GetQuizByIdUseCase,
  SaveQuizContentsUseCase,
  UpdateQuizUseCase,
} from "../../applications/Quiz Use-case";
import { createTypeOrmRepositories } from "../typeorm-container";
import { passwordHasher } from "../../infrastructure/security";
import {
  CreateAdminUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  GetAllUsersUseCase,
  GetQuizzesForUserUseCase,
  GetUserByIdUseCase,
  LoginUseCase,
  RegisterUserUseCase,
  UpdateUserUseCase,
} from "../../applications/User Use-case";
import {
  AddQuizToClassUseCase,
  AddStudentsToClassUseCase,
  AddUserToClassUseCase,
  CreateClassUseCase,
  DeleteClassUseCase,
  GetAllClassesUseCase,
  GetClassByIdUseCase,
  GetQuizzesOfClassUseCase,
  GetStudentsInClassUseCase,
  MoveStudentsUseCase,
  RemoveStudentFromClassUseCase,
  UpdateClassUseCase,
} from "../../applications/Class Use-case";
import { GetAssignedQuizzesForUserUseCase } from "../../applications/AssignedQuiz Use-case";
import { GetDashboardStatsUseCase } from "../../applications/Dashboard Use-case";
import {
  GetAllAttemptsUseCase,
  GetBestAttemptsByQuizUseCase,
  GetBestAttemptsByUserUseCase,
  GetLatestAttemptUseCase,
  GetUserResultsStatsUseCase,
  StartAttemptUseCase,
  SubmitAttemptUseCase,
  TempSaveAttemptUseCase,
} from "../../applications/UserQuizResult Use-case";
import type { RawAnswerInput } from "../../domain/entities/user-quiz-result.entity";
import { UserQuizResultController } from "./controllers/userQuizResultController";
import { UserController } from "./controllers/userController";
import { ClassController } from "./controllers/classController";
import { AssignedQuizController } from "./controllers/assignedQuizController";
import { DashboardController } from "./controllers/dashboardController";
import { RefreshTokenEntity } from "../../domain/entities";
import { createHash, randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import type { PresentationHandlers } from "./controllers/workflow.controller";
import { BlogController } from "./controllers/BlogControllers";
import { CategoryController } from "./controllers/categoryController";
import { CourseController } from "./controllers/CourseController";
import { CourseRegistrationController } from "./controllers/courseRegistrationController";
import { EventController } from "./controllers/EventController";
import { EventRegistrationController } from "./controllers/eventRegistrationController";
import { InstructorController } from "./controllers/instructorController";
import { QuestionController } from "./controllers/QuestionController";
import { QuizController } from "./controllers/QuizController";

export function createCrudControllers() {
  const repositories = createTypeOrmRepositories();

  const blog = new BlogController({
    create: new CreateBlogUseCase(repositories.blogs),
    getAll: new GetAllBlogsUseCase(repositories.blogs),
    getById: new GetBlogByIdUseCase(repositories.blogs),
    update: new UpdateBlogUseCase(repositories.blogs),
    remove: new DeleteBlogUseCase(repositories.blogs),
  });

  const category = new CategoryController({
    create: new CreateCategoryUseCase(repositories.categories),
    getAll: new GetAllCategoriesUseCase(repositories.categories),
    getById: new GetCategoryByIdUseCase(repositories.categories),
    update: new UpdateCategoryUseCase(repositories.categories),
    remove: new DeleteCategoryUseCase(repositories.categories),
  });

  const course = new CourseController({
    create: new CreateCourseUseCase(repositories.courses),
    getAll: new GetAllCoursesUseCase(repositories.courses),
    getById: new GetCourseByIdUseCase(repositories.courses),
    update: new UpdateCourseUseCase(repositories.courses),
    remove: new DeleteCourseUseCase(repositories.courses),
  });

  const event = new EventController({
    create: new CreateEventUseCase(repositories.events),
    getAll: new GetAllEventsUseCase(repositories.events),
    getById: new GetEventByIdUseCase(repositories.events),
    update: new UpdateEventUseCase(repositories.events),
    remove: new DeleteEventUseCase(repositories.events),
  });

  const courseRegistration = new CourseRegistrationController({
    create: new CreateCourseRegistrationUseCase(
      repositories.courseRegistrations,
    ),
    getAll: new GetAllCourseRegistrationsUseCase(
      repositories.courseRegistrations,
    ),
    getById: new GetCourseRegistrationByIdUseCase(
      repositories.courseRegistrations,
    ),
    update: new UpdateCourseRegistrationUseCase(
      repositories.courseRegistrations,
    ),
    remove: new DeleteCourseRegistrationUseCase(
      repositories.courseRegistrations,
    ),
  });

  const eventRegistration = new EventRegistrationController({
    create: new CreateEventRegistrationUseCase(repositories.eventRegistrations),
    getAll: new GetAllEventRegistrationsUseCase(
      repositories.eventRegistrations,
    ),
    getById: new GetEventRegistrationByIdUseCase(
      repositories.eventRegistrations,
    ),
    update: new UpdateEventRegistrationUseCase(repositories.eventRegistrations),
    remove: new DeleteEventRegistrationUseCase(repositories.eventRegistrations),
  });

  const instructor = new InstructorController({
    create: new CreateInstructorUseCase(repositories.instructors),
    getAll: new GetAllInstructorsUseCase(repositories.instructors),
    getById: new GetInstructorByIdUseCase(repositories.instructors),
    update: new UpdateInstructorUseCase(repositories.instructors),
    remove: new DeleteInstructorUseCase(repositories.instructors),
  });

  const question = new QuestionController({
    create: new CreateQuestionUseCase(repositories.questions),
    getAll: new GetAllQuestionsUseCase(repositories.questions),
    getById: new GetQuestionByIdUseCase(repositories.questions),
    update: new UpdateQuestionUseCase(repositories.questions),
    remove: new DeleteQuestionUseCase(repositories.questions),
  },
  new GetQuestionsByQuizIdUseCase(repositories.questions),
  new GetQuizByIdUseCase(repositories.quizzes));

  const quiz = new QuizController({
    create: new CreateQuizUseCase(repositories.quizzes),
    getAll: new GetAllQuizzesUseCase(repositories.quizzes),
    getById: new GetQuizByIdUseCase(repositories.quizzes),
    update: new UpdateQuizUseCase(repositories.quizzes),
    remove: new DeleteQuizUseCase(repositories.quizzes),
  }, new SaveQuizContentsUseCase(repositories.quizzes));

  return {
    blog,
    category,
    course,
    event,
    courseRegistration,
    eventRegistration,
    instructor,
    question,
    quiz,
  };
}

export function createWorkflowControllers() {
  const repositories = createTypeOrmRepositories();
  const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!tokenSecret) throw new Error("ACCESS_TOKEN_SECRET is required");

  const hashToken = (token: string) =>
    createHash("sha256").update(token).digest("hex");
  const tokenIssuer = {
    issueAccessToken: (user: import("../../domain/entities").UserEntity) =>
      jwt.sign(user.toPublicJSON(), tokenSecret, { expiresIn: "15m" }),
    createRefreshToken: async (userId: number) => {
      const rawToken = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await repositories.refreshTokens.create(
        RefreshTokenEntity.create({
          userId,
          tokenHash: hashToken(rawToken),
          expiresAt,
        }),
      );
      return { rawToken, tokenHash: hashToken(rawToken), expiresAt };
    },
  };

  const login = new LoginUseCase({
    users: repositories.users,
    hasher: passwordHasher,
    tokens: tokenIssuer,
  });
  const getUser = new GetUserByIdUseCase(repositories.users);
  const userController = new UserController({
    login: (request) => login.execute(request.body as never),
    register: (request) =>
      new RegisterUserUseCase(
        repositories.users,
        passwordHasher,
        repositories.users,
      ).execute(request.body as never),
    createAdmin: (request) =>
      new CreateAdminUseCase(repositories.users, passwordHasher).execute(
        request.body as never,
      ),
    getUsers: () => new GetAllUsersUseCase(repositories.users).execute(),
    addUser: (request) =>
      new CreateUserUseCase(repositories.users, passwordHasher).execute(
        request.body as never,
      ),
    updateUser: (request) =>
      new UpdateUserUseCase(repositories.users).execute(
        request.params.id ?? "",
        async (entity) => entity.updateProfile((request.body ?? {}) as never),
      ),
    deleteUser: (request) =>
      new DeleteUserUseCase(repositories.users).execute(
        request.params.id ?? "",
      ),
    refresh: async (request) => {
      const rawToken = String(
        (request.body as { refreshToken?: string })?.refreshToken ?? "",
      );
      const stored = await repositories.refreshTokens.getActiveByHash(
        hashToken(rawToken),
      );
      if (!stored) throw new Error("Invalid or expired refresh token");
      const user = await getUser.execute(stored.userId);
      return { accessToken: tokenIssuer.issueAccessToken(user) };
    },
    logout: async (request) => {
      const rawToken = String(
        (request.body as { refreshToken?: string })?.refreshToken ?? "",
      );
      await repositories.refreshTokens.revokeByHash(hashToken(rawToken));
    },
    me: (request) =>
      getUser.execute(Number((request.user as { id?: number })?.id)),
    getQuizzesForUser: (request) =>
      new GetQuizzesForUserUseCase(repositories.users).execute(
        String(request.params.userId ?? ""),
      ),
  } satisfies PresentationHandlers);

  const classController = new ClassController({
    createClass: (request) =>
      new CreateClassUseCase(repositories.classes).execute(
        request.body as never,
      ),
    getAllClasses: () =>
      new GetAllClassesUseCase(repositories.classes).execute(),
    getClassById: (request) =>
      new GetClassByIdUseCase(repositories.classes).execute(
        request.params.classId ?? "",
      ),
    addUserToClass: (request) =>
      new AddUserToClassUseCase(repositories.classes).execute(
        request.params.classId ?? "",
        Number((request.body as { userId?: number })?.userId),
      ),
    addStudentsToClass: (request) =>
      new AddStudentsToClassUseCase(repositories.classes).execute(
        request.params.classId ?? "",
        (request.body as { studentIds?: number[] })?.studentIds ?? [],
      ),
    removeStudentFromClass: (request) =>
      new RemoveStudentFromClassUseCase(repositories.classes).execute(
        request.params.classId ?? "",
        Number(request.params.studentId),
      ),
    moveStudents: (request) => {
      const body = (request.body ?? {}) as {
        fromClassId: string;
        toClassId: string;
        studentIds: number[];
      };
      return new MoveStudentsUseCase(repositories.classes).execute(
        body.fromClassId,
        body.toClassId,
        body.studentIds,
      );
    },
    addQuizToClass: (request) =>
      new AddQuizToClassUseCase(repositories.classes).execute(
        request.params.classId ?? "",
        Number((request.body as { quizId?: number })?.quizId),
      ),
    getStudentsInClass: (request) =>
      new GetStudentsInClassUseCase(repositories.classes).execute(
        request.params.classId ?? "",
      ),
    getQuizzesOfClass: (request) =>
      new GetQuizzesOfClassUseCase(repositories.classes).execute(
        request.params.classId ?? "",
      ),
    updateClass: (request) =>
      new UpdateClassUseCase(repositories.classes).execute(
        request.params.classId ?? "",
        (request.body ?? {}) as never,
      ),
    deleteClass: (request) =>
      new DeleteClassUseCase(repositories.classes).execute(
        request.params.classId ?? "",
      ),
  });

  const attemptQueries = {
    getQuiz: (quizId: number) => repositories.quizzes.getById(quizId),
    getQuestions: (quizId: number) =>
      repositories.questions.getByQuizId(String(quizId)),
  };
  const resultController = new UserQuizResultController({
    startAttempt: async (request) => {
      const result = await new StartAttemptUseCase(
        repositories.results,
        repositories.results,
        repositories.attempts,
        attemptQueries,
      ).execute(
        Number((request.user as { id?: number })?.id),
        Number(request.params.quizId),
      );
      return { ...result.toJSON(), serverNow: new Date() };
    },
    tempSave: (request) => {
      const body = (request.body ?? {}) as {
        answers?: RawAnswerInput[];
        state?: Record<string, unknown>;
      };
      return new TempSaveAttemptUseCase(
        repositories.results,
        attemptQueries,
      ).execute(
        request.params.resultId ?? "",
        Number((request.user as { id?: number })?.id),
        body.answers ?? [],
        body.state,
      );
    },
    submitAttempt: (request) => {
      const body = (request.body ?? {}) as { answers?: RawAnswerInput[] };
      return new SubmitAttemptUseCase(repositories.results, attemptQueries).execute(
        request.params.resultId ?? "",
        Number((request.user as { id?: number })?.id),
        body.answers ?? [],
      );
    },
    getLatestResult: async (request) => {
      const result = await new GetLatestAttemptUseCase(
        repositories.results,
        attemptQueries,
      ).execute(
        Number((request.user as { id?: number })?.id),
        Number(request.params.quizId),
      );
      return result
        ? { ...result.toJSON(), serverNow: new Date() }
        : null;
    },
    getAllAttempts: (request) =>
      new GetAllAttemptsUseCase(repositories.results).execute(
        Number((request.user as { id?: number })?.id),
        Number(request.params.quizId),
      ),
    getUserResultsStats: (request) =>
      new GetUserResultsStatsUseCase(repositories.results).execute(
        Number((request.user as { id?: number })?.id),
      ),
    getUsersBestAttemptsByQuiz: (request) =>
      new GetBestAttemptsByQuizUseCase(repositories.results).execute(
        Number(request.params.quizId),
      ),
    getUserQuizBestAttempt: (request) =>
      repositories.results.getBest(
        Number(request.params.userId),
        Number(request.params.quizId),
      ),
    getUserQuizSummaryByUserId: (request) =>
      new GetBestAttemptsByUserUseCase(repositories.results).execute(
        Number(request.params.userId),
      ),
    getBestAttemptsByQuiz: (request) =>
      new GetBestAttemptsByQuizUseCase(repositories.results).execute(
        Number(request.params.quizId),
      ),
    getBestAttemptsByUserId: (request) =>
      new GetBestAttemptsByUserUseCase(repositories.results).execute(
        Number(request.params.userId),
      ),
  });

  const assignedQuizController = new AssignedQuizController({
    getAssignedQuizzes: (request) =>
      new GetAssignedQuizzesForUserUseCase(
        repositories.assignedQuizzes,
      ).execute(Number((request.user as { id?: number })?.id)),
  });
  const dashboardController = new DashboardController({
    getDashboardStats: () =>
      new GetDashboardStatsUseCase(repositories.dashboard).execute(),
  });

  return {
    userController,
    classController,
    resultController,
    assignedQuizController,
    dashboardController,
  };
}
