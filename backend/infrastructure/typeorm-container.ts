import { DataSourceConfig } from "../config/data-source";
import {
  AttemptCounterRepository,
  AuditLogRepository,
  BlogRepositoryImpl,
  CategoryRepository,
  ClassRepository,
  CourseRepository,
  CourseRegistrationRepository,
  EventRepository,
  EventRegistrationRepository,
  InstructorRepository,
  QuestionRepository,
  QuizRepository,
  RefreshTokenRepository,
  UserRepository,
  UserQuizResultRepository,
  AssignedQuizTypeOrmRepository,
  DashboardTypeOrmRepository,
} from "./repositories";
import {
  AttemptCounter,
  AuditLog,
  Blog,
  Category,
  Class,
  ClassQuiz,
  ClassStudent,
  Course,
  CourseRegistration,
  Event,
  EventRegistration,
  Instructor,
  Question,
  Quiz,
  RefreshToken,
  User,
  UserQuizResult,
} from "./persistence";

export async function initializeTypeOrm() {
  if (!DataSourceConfig.isInitialized) {
    await DataSourceConfig.initialize();
  }
  return DataSourceConfig;
}

export function createTypeOrmRepositories() {
  if (!DataSourceConfig.isInitialized) {
    throw new Error(
      "TypeORM DataSource must be initialized before creating repositories",
    );
  }

  return {
    attempts: new AttemptCounterRepository(
      DataSourceConfig.getRepository(AttemptCounter),
    ),
    auditLogs: new AuditLogRepository(DataSourceConfig.getRepository(AuditLog)),
    blogs: new BlogRepositoryImpl(DataSourceConfig.getRepository(Blog)),
    categories: new CategoryRepository(
      DataSourceConfig.getRepository(Category),
      DataSourceConfig.getRepository(Quiz),
    ),
    classes: new ClassRepository(
      DataSourceConfig.getRepository(Class),
      DataSourceConfig.getRepository(ClassStudent),
      DataSourceConfig.getRepository(ClassQuiz),
    ),
    courses: new CourseRepository(DataSourceConfig.getRepository(Course)),
    courseRegistrations: new CourseRegistrationRepository(
      DataSourceConfig.getRepository(CourseRegistration),
    ),
    events: new EventRepository(DataSourceConfig.getRepository(Event)),
    eventRegistrations: new EventRegistrationRepository(
      DataSourceConfig.getRepository(EventRegistration),
    ),
    instructors: new InstructorRepository(
      DataSourceConfig.getRepository(Instructor),
    ),
    questions: new QuestionRepository(DataSourceConfig.getRepository(Question)),
    quizzes: new QuizRepository(
      DataSourceConfig.getRepository(Quiz),
      DataSourceConfig.getRepository(Question),
      DataSourceConfig,
    ),
    refreshTokens: new RefreshTokenRepository(
      DataSourceConfig.getRepository(RefreshToken),
    ),
    users: new UserRepository(
      DataSourceConfig.getRepository(User),
      DataSourceConfig.getRepository(UserQuizResult),
    ),
    results: new UserQuizResultRepository(
      DataSourceConfig.getRepository(UserQuizResult),
    ),
    assignedQuizzes: new AssignedQuizTypeOrmRepository(
      DataSourceConfig.getRepository(ClassStudent),
      DataSourceConfig.getRepository(ClassQuiz),
      DataSourceConfig.getRepository(Quiz),
    ),
    dashboard: new DashboardTypeOrmRepository(
      DataSourceConfig.getRepository(User),
      DataSourceConfig.getRepository(Quiz),
      DataSourceConfig.getRepository(UserQuizResult),
    ),
  };
}
