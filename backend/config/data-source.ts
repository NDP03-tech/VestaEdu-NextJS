import { DataSource } from "typeorm";
import { AttemptCounter } from "../infrastructure/persistence/AttemptCounter";
import { AuditLog } from "../infrastructure/persistence/AuditLog";
import { Blog } from "../infrastructure/persistence/Blog";
import { Category } from "../infrastructure/persistence/Category";
import { Class } from "../infrastructure/persistence/Class";
import { ClassQuiz } from "../infrastructure/persistence/ClassQuiz";
import { ClassStudent } from "../infrastructure/persistence/classStudents";
import { Course } from "../infrastructure/persistence/Course";
import { CourseRegistration } from "../infrastructure/persistence/CourseRegistration";
import { Event } from "../infrastructure/persistence/Event";
import { EventRegistration } from "../infrastructure/persistence/EventRegistration";
import { Instructor } from "../infrastructure/persistence/Instructor";
import { Question } from "../infrastructure/persistence/Question";
import { Quiz } from "../infrastructure/persistence/Quiz";
import { RefreshToken } from "../infrastructure/persistence/RefreshToken";
import { User } from "../infrastructure/persistence/User";
import { UserQuizResult } from "../infrastructure/persistence/UserQuizResult";

const dbPoolMax = Number(process.env.DB_POOL_MAX ?? 20);
if (!Number.isSafeInteger(dbPoolMax) || dbPoolMax < 1) {
  throw new Error("DB_POOL_MAX must be a positive integer");
}

export const DataSourceConfig = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_NAME || undefined,
  entities: [
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
  ],
  migrations: [],
  extra: {
    max: dbPoolMax,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  },
  synchronize: false,
  logging: process.env.NODE_ENV !== "production",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
