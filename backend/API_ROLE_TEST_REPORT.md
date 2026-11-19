# API, Role And Test Report

Date: 2026-11-18
Project: VestaEdu-NextJS/backend

## Executive Summary

- TypeScript typecheck: PASS
- TypeScript build: PASS
- Mock API route suite: 100/107 pass; the focused question-by-quiz route tests pass 4/4
- Runtime/API smoke test: STARTUP PASS for the TypeORM entrypoint; the process stayed alive and was stopped after verification.
- The old `MODULE_NOT_FOUND` startup failure is removed: `index.js` now delegates to `dist/index.js`, which initializes the TypeORM composition root.
- Live HTTP assertions against the TypeORM entrypoint still require PostgreSQL with the configured schema.

## Role Rules

| Role    | Intended access                                                              |
| ------- | ---------------------------------------------------------------------------- |
| Public  | Login, registration, public catalog/detail reads, event registration, health |
| student | Own profile, own quiz attempts, own assigned quizzes, course registration    |
| teacher | Content management, classes, questions, quizzes, dashboard, reports          |
| admin   | All administrative operations, users, instructors, reports                   |

The `authorizeRoles` middleware performs exact role matching against `req.user.role`.

## API Matrix

Legend: `Public` means no token; `Auth` means token required; `Auth: roles` means token and one of the listed roles.

### User API (`/api`)

| Method | Path                   | Access      | Result                                           |
| ------ | ---------------------- | ----------- | ------------------------------------------------ |
| POST   | `/api/login`           | Public      | Not live-tested: startup blocked                 |
| POST   | `/api/register`        | Public      | Not live-tested: startup blocked                 |
| POST   | `/api/create-admin`    | Auth: admin | Not live-tested: startup blocked                 |
| GET    | `/api/users`           | Auth: admin | Not live-tested: startup blocked                 |
| POST   | `/api/users`           | Auth: admin | Not live-tested: startup blocked                 |
| PUT    | `/api/users/:id`       | Auth: admin | Not live-tested: startup blocked                 |
| DELETE | `/api/users/:id`       | Auth: admin | Not live-tested: startup blocked                 |
| POST   | `/api/refresh`         | Public      | Not live-tested: startup blocked                 |
| POST   | `/api/logout`          | Public      | Not live-tested: startup blocked                 |
| GET    | `/api/me`              | Auth        | Not live-tested: startup blocked                 |
| GET    | `/api/:userId/quizzes` | Auth        | Ownership must be checked in controller/use-case |

### Course API (`/api/course`)

| Method | Path                 | Access               | Result                           |
| ------ | -------------------- | -------------------- | -------------------------------- |
| POST   | `/api/course/create` | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/course`        | Public               | Not live-tested: startup blocked |
| GET    | `/api/course/:id`    | Public               | Not live-tested: startup blocked |
| PUT    | `/api/course/:id`    | Auth: admin, teacher | Not live-tested: startup blocked |
| DELETE | `/api/course/:id`    | Auth: admin, teacher | Not live-tested: startup blocked |

### Blog API (`/api/blog`)

| Method | Path               | Access               | Result                           |
| ------ | ------------------ | -------------------- | -------------------------------- |
| POST   | `/api/blog/create` | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/blog`        | Public               | Not live-tested: startup blocked |
| GET    | `/api/blog/:id`    | Public               | Not live-tested: startup blocked |
| PUT    | `/api/blog/:id`    | Auth: admin, teacher | Not live-tested: startup blocked |
| DELETE | `/api/blog/:id`    | Auth: admin, teacher | Not live-tested: startup blocked |

### Event API (`/api/events`)

| Method | Path                 | Access               | Result                           |
| ------ | -------------------- | -------------------- | -------------------------------- |
| POST   | `/api/events/create` | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/events`        | Public               | Not live-tested: startup blocked |
| GET    | `/api/events/:id`    | Public               | Not live-tested: startup blocked |
| PUT    | `/api/events/:id`    | Auth: admin, teacher | Not live-tested: startup blocked |
| DELETE | `/api/events/:id`    | Auth: admin, teacher | Not live-tested: startup blocked |

### Quiz API (`/api/quizzes`)

| Method | Path                              | Access               | Result                           |
| ------ | --------------------------------- | -------------------- | -------------------------------- |
| POST   | `/api/quizzes`                    | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/quizzes`                    | Public               | Not live-tested: startup blocked |
| GET    | `/api/quizzes/category/:category` | Public               | Not live-tested: startup blocked |
| GET    | `/api/quizzes/:id`                | Public               | Not live-tested: startup blocked |
| PUT    | `/api/quizzes/:id`                | Auth: admin, teacher | Not live-tested: startup blocked |
| DELETE | `/api/quizzes/:id`                | Auth: admin, teacher | Not live-tested: startup blocked |

### Question API (`/api/questions`)

Question authoring routes require `Auth: admin, teacher`. The by-quiz read route also allows authenticated students and returns a student-safe projection without answer keys.

| Method | Path                             | Access               | Result                           |
| ------ | -------------------------------- | -------------------- | -------------------------------- |
| POST   | `/api/questions`                 | Auth: admin, teacher | Not live-tested: startup blocked |
| PUT    | `/api/questions/:id`             | Auth: admin, teacher | Not live-tested: startup blocked |
| DELETE | `/api/questions/:id`             | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/questions/by-quiz/:quizId` | Auth: admin, teacher, student | Mock route tests pass; live DB not tested |
| GET    | `/api/questions/:id`             | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/questions`                 | Auth: admin, teacher | Not live-tested: startup blocked |

### Category API (`/api/categories`)

| Method | Path                                  | Access               | Result                                                 |
| ------ | ------------------------------------- | -------------------- | ------------------------------------------------------ |
| GET    | `/api/categories`                     | Public               | Not live-tested: startup blocked                       |
| POST   | `/api/categories`                     | Auth: admin, teacher | Not live-tested: startup blocked                       |
| GET    | `/api/categories/:categoryId/quizzes` | Public               | Uses legacy inline model query; needs TypeORM use-case |
| DELETE | `/api/categories/:categoryId`         | Auth: admin          | Not live-tested: startup blocked                       |

### Class API (`/api/classes`)

All routes currently require `Auth: admin, teacher`.

| Method | Path                                        | Access               | Result                           |
| ------ | ------------------------------------------- | -------------------- | -------------------------------- |
| POST   | `/api/classes`                              | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/classes`                              | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/classes/:classId`                     | Auth: admin, teacher | Not live-tested: startup blocked |
| POST   | `/api/classes/:classId/add-user`            | Auth: admin, teacher | Not live-tested: startup blocked |
| POST   | `/api/classes/:classId/add-quiz`            | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/classes/:classId/quizzes`             | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/classes/:classId/students`            | Auth: admin, teacher | Not live-tested: startup blocked |
| POST   | `/api/classes/:classId/students`            | Auth: admin, teacher | Not live-tested: startup blocked |
| POST   | `/api/classes/move-students`                | Auth: admin, teacher | Not live-tested: startup blocked |
| DELETE | `/api/classes/:classId/students/:studentId` | Auth: admin, teacher | Not live-tested: startup blocked |
| PUT    | `/api/classes/:classId`                     | Auth: admin, teacher | Not live-tested: startup blocked |
| DELETE | `/api/classes/:classId`                     | Auth: admin, teacher | Not live-tested: startup blocked |

### Course Registration (`/api/course-registrations`)

| Method | Path                        | Access                        | Result                           |
| ------ | --------------------------- | ----------------------------- | -------------------------------- |
| POST   | `/api/course-registrations` | Auth: admin, teacher, student | Not live-tested: startup blocked |
| GET    | `/api/course-registrations` | Auth: admin, teacher          | Not live-tested: startup blocked |

### Event Registration (`/api/event-registrations`)

| Method | Path                       | Access               | Result                           |
| ------ | -------------------------- | -------------------- | -------------------------------- |
| POST   | `/api/event-registrations` | Public               | Not live-tested: startup blocked |
| GET    | `/api/event-registrations` | Auth: admin, teacher | Not live-tested: startup blocked |

The GET endpoint was tightened because registrations contain personal information.

### Dashboard (`/api/dashboard`)

| Method | Path                   | Access               | Result                           |
| ------ | ---------------------- | -------------------- | -------------------------------- |
| GET    | `/api/dashboard/stats` | Auth: admin, teacher | Not live-tested: startup blocked |

### Assigned Quizzes (`/api/assigned-quizzes`)

| Method | Path                    | Access | Result                           |
| ------ | ----------------------- | ------ | -------------------------------- |
| GET    | `/api/assigned-quizzes` | Auth   | Not live-tested: startup blocked |

### Quiz Results (`/api/results`)

| Method | Path                                                  | Access               | Result                           |
| ------ | ----------------------------------------------------- | -------------------- | -------------------------------- |
| POST   | `/api/results/start/:quizId`                          | Auth                 | Not live-tested: startup blocked |
| POST   | `/api/results/temp/:resultId`                         | Auth                 | Not live-tested: startup blocked |
| POST   | `/api/results/submit/:resultId`                       | Auth                 | Not live-tested: startup blocked |
| GET    | `/api/results/latest/:quizId`                         | Auth                 | Not live-tested: startup blocked |
| GET    | `/api/results/attempts/:quizId`                       | Auth                 | Not live-tested: startup blocked |
| GET    | `/api/results/user/results-stats`                     | Auth                 | Not live-tested: startup blocked |
| GET    | `/api/results/quiz/:quizId/best-attempts`             | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/results/user/:userId/quiz/:quizId/best-attempt` | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/results/user-summary/:userId`                   | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/api/results/best-attempts/:quizId`                  | Auth                 | Not live-tested: startup blocked |
| GET    | `/api/results/user-best-attempts/:userId`             | Auth: admin, teacher | Not live-tested: startup blocked |

Ownership checks are still required for current-user result endpoints.

### Instructors (`/api/instructors`)

| Method | Path                    | Access      | Result                           |
| ------ | ----------------------- | ----------- | -------------------------------- |
| GET    | `/api/instructors`      | Public      | Not live-tested: startup blocked |
| GET    | `/api/instructors/:id`  | Public      | Not live-tested: startup blocked |
| POST   | `/api/instructors`      | Auth: admin | Not live-tested: startup blocked |
| PUT    | `/api/instructors/:id`  | Auth: admin | Not live-tested: startup blocked |
| DELETE | `/api/instructors/:id`  | Auth: admin | Not live-tested: startup blocked |
| POST   | `/api/instructors/bulk` | Auth: admin | Not live-tested: startup blocked |

### Upload and Health

| Method | Path                | Access               | Result                           |
| ------ | ------------------- | -------------------- | -------------------------------- |
| POST   | `/api/upload-media` | Auth: admin, teacher | Not live-tested: startup blocked |
| GET    | `/uploads/*`        | Public static file   | Not live-tested: startup blocked |
| GET    | `/health`           | Public               | Not live-tested: startup blocked |

## Cleanup Performed

Removed files that had no references in the workspace:

- `infrastructure/presentation/controllers/blog.controller.ts` (duplicate of `BlogControllers.ts`)
- `middleware/generateToken.js`
- `middleware/uploadMiddleware.js`

Also removed the unused `body-parser` import from `index.js`.

## Remaining Migration Blockers

1. The old `categories.js`, `auditLog.js` and other legacy route files are no longer loaded by the TypeORM entrypoint.
2. Audit logging is not yet restored in the new entrypoint; the old middleware remains unused because it imports the removed Sequelize model.
3. `npm test` has no real test command yet.
4. HTTP assertions still need a PostgreSQL database with the configured schema and seeded users/tokens.

## Commands Executed

```text
npm run typecheck  PASS
npm run build      PASS
npm test           FAIL (no test specified)
node index.js      STARTUP PASS (process stayed alive; stopped after smoke check)
```

Until the startup and route migration blockers are removed, API-level HTTP tests cannot be honestly marked as passed.
