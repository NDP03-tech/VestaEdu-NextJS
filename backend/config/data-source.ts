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
import { AddDomainFields20260917 } from "../infrastructure/migrations/AddDomainFields";

export const DataSourceConfig = new DataSource({
  type: "postgres",
  replication: {
    master: {
      port: Number(process.env.DB_MASTER_PORT) || 5432,
      host: process.env.DB_MASTER_HOST || "localhost",
      username: process.env.DB_MASTER_USER || "postgres",
      password: process.env.DB_MASTER_PASS || undefined,
      database: process.env.DB_NAME || undefined,
    },
    slaves: [
      {
        port: Number(process.env.DB_SLAVE1_PORT) || 5433,
        host: process.env.DB_SLAVE1_HOST || "localhost",
        username: process.env.DB_SLAVE1_USER || "postgres",
        password: process.env.DB_SLAVE1_PASS || undefined,
      },
    ],
  },
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
  migrations: [AddDomainFields20260917],
  synchronize: false,
  logging: true,
  ssl: process.env.NODE_ENV === "production" ? true : false,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
