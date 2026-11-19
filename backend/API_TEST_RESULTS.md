# API Test Results

> Generated: 2026-11-18 09:01:47 (UTC+7)
> Project: VestaEdu-NextJS/backend

## Summary

| Metric | Value |
|--------|-------|
| Overall | ❌ SOME FAILED |
| Total tests | 111 |
| ✅ Passed | 105 |
| ❌ Failed | 6 |
| ⏸ Pending | 0 |
| Duration | 5.85s |

## ❌ Failed Tests

### Blog API

**PUT /api/blog/1 — teacher → 200**
```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
    at Object.toBe (C:\Users\fnfinn\Desktop\Personal\VestaEdu-NextJS\backend\scripts\api-test\api.test.ts:171:24)
    at processTicksAndRejections (node:internal/process/task_queues:104:5)
```
### Course API

**PUT /api/course/1 — admin → 200**
```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
    at Object.toBe (C:\Users\fnfinn\Desktop\Personal\VestaEdu-NextJS\backend\scripts\api-test\api.test.ts:211:24)
    at processTicksAndRejections (node:internal/process/task_queues:104:5)
```
### Event API

**PUT /api/events/1 — teacher → 200**
```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
    at Object.toBe (C:\Users\fnfinn\Desktop\Personal\VestaEdu-NextJS\backend\scripts\api-test\api.test.ts:252:24)
    at processTicksAndRejections (node:internal/process/task_queues:104:5)
```
### Question API

**POST /api/questions — teacher → 201**
```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 500
    at Object.toBe (C:\Users\fnfinn\Desktop\Personal\VestaEdu-NextJS\backend\scripts\api-test\api.test.ts:409:24)
    at processTicksAndRejections (node:internal/process/task_queues:104:5)
```

**PUT /api/questions/1 — admin → 200**
```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
    at Object.toBe (C:\Users\fnfinn\Desktop\Personal\VestaEdu-NextJS\backend\scripts\api-test\api.test.ts:415:24)
    at processTicksAndRejections (node:internal/process/task_queues:104:5)
```
### Instructor API

**PUT /api/instructors/1 — admin → 200**
```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
    at Object.toBe (C:\Users\fnfinn\Desktop\Personal\VestaEdu-NextJS\backend\scripts\api-test\api.test.ts:624:24)
    at processTicksAndRejections (node:internal/process/task_queues:104:5)
```

## Detailed Results by API Group

### ✅ Health (1/1 passed)

| Test | Status | ms |
|------|--------|----|
| GET /health → 200 OK | ✅ PASS | 91 |

### ✅ User API — Auth (8/8 passed)

| Test | Status | ms |
|------|--------|----|
| POST /api/login — valid credentials → 200 + accessToken | ✅ PASS | 54 |
| POST /api/login — wrong password → 401 | ✅ PASS | 11 |
| POST /api/register — valid data → 201 | ✅ PASS | 11 |
| POST /api/register — missing fields → 400 | ✅ PASS | 12 |
| POST /api/refresh — valid refreshToken → 200 + accessToken | ✅ PASS | 18 |
| POST /api/logout → 200 | ✅ PASS | 10 |
| GET /api/me — with token → 200 user data | ✅ PASS | 13 |
| GET /api/me — no token → 401 | ✅ PASS | 10 |

### ✅ User API — Admin CRUD (9/9 passed)

| Test | Status | ms |
|------|--------|----|
| POST /api/create-admin — admin → 201 | ✅ PASS | 12 |
| POST /api/create-admin — teacher → 403 | ✅ PASS | 9 |
| GET /api/users — admin → 200 | ✅ PASS | 18 |
| GET /api/users — no token → 401 | ✅ PASS | 12 |
| GET /api/users — student → 403 | ✅ PASS | 16 |
| POST /api/users — admin → 201 | ✅ PASS | 16 |
| PUT /api/users/1 — admin → 200 | ✅ PASS | 31 |
| DELETE /api/users/1 — admin → 204 | ✅ PASS | 24 |
| GET /api/1/quizzes — auth → 200 | ✅ PASS | 38 |

### ❌ Blog API (6/7 passed)

| Test | Status | ms |
|------|--------|----|
| GET /api/blog — public → 200 | ✅ PASS | 20 |
| GET /api/blog/1 — public → 200 | ✅ PASS | 9 |
| POST /api/blog/create — admin → 201 | ✅ PASS | 15 |
| POST /api/blog/create — no token → 401 | ✅ PASS | 17 |
| POST /api/blog/create — student → 403 | ✅ PASS | 22 |
| PUT /api/blog/1 — teacher → 200 | ❌ FAIL | 19 |
| DELETE /api/blog/1 — admin → 204 | ✅ PASS | 9 |

### ❌ Course API (5/6 passed)

| Test | Status | ms |
|------|--------|----|
| GET /api/course — public → 200 | ✅ PASS | 9 |
| GET /api/course/1 — public → 200 | ✅ PASS | 15 |
| POST /api/course/create — teacher → 201 | ✅ PASS | 18 |
| POST /api/course/create — no token → 401 | ✅ PASS | 8 |
| PUT /api/course/1 — admin → 200 | ❌ FAIL | 10 |
| DELETE /api/course/1 — admin → 204 | ✅ PASS | 8 |

### ❌ Event API (5/6 passed)

| Test | Status | ms |
|------|--------|----|
| GET /api/events — public → 200 | ✅ PASS | 6 |
| GET /api/events/1 — public → 200 | ✅ PASS | 7 |
| POST /api/events/create — admin → 201 | ✅ PASS | 9 |
| POST /api/events/create — student → 403 | ✅ PASS | 8 |
| PUT /api/events/1 — teacher → 200 | ❌ FAIL | 9 |
| DELETE /api/events/1 — admin → 204 | ✅ PASS | 9 |

### ✅ Quiz API (8/8 passed)

| Test | Status | ms |
|------|--------|----|
| GET /api/quizzes — public → 200 | ✅ PASS | 7 |
| GET /api/quizzes/1 — public → 200 | ✅ PASS | 9 |
| POST /api/quizzes — teacher → 201 | ✅ PASS | 10 |
| POST /api/quizzes — no token → 401 | ✅ PASS | 8 |
| PUT /api/quizzes/1 — admin → 200 | ✅ PASS | 8 |
| PUT /api/quizzes/1/contents — teacher saves quiz and duplicate-stem questions | ✅ PASS | 10 |
| PUT /api/quizzes/1/contents requires teacher or admin auth | ✅ PASS | 12 |
| DELETE /api/quizzes/1 — admin → 204 | ✅ PASS | 6 |

### ❌ Question API (9/11 passed)

| Test | Status | ms |
|------|--------|----|
| GET /api/questions/by-quiz/1 — requires authentication | ✅ PASS | 7 |
| GET /api/questions/by-quiz/1 — student receives no answer key | ✅ PASS | 29 |
| GET /api/questions/by-quiz/1 — teacher receives authoring data | ✅ PASS | 12 |
| GET /api/questions/by-quiz/invalid — rejects invalid quiz IDs | ✅ PASS | 7 |
| GET /api/questions — admin → 200 | ✅ PASS | 11 |
| GET /api/questions — no token → 401 | ✅ PASS | 8 |
| GET /api/questions — student → 403 | ✅ PASS | 6 |
| GET /api/questions/1 — teacher → 200 | ✅ PASS | 10 |
| POST /api/questions — teacher → 201 | ❌ FAIL | 11 |
| PUT /api/questions/1 — admin → 200 | ❌ FAIL | 12 |
| DELETE /api/questions/1 — admin → 204 | ✅ PASS | 11 |

### ✅ Category API (6/6 passed)

| Test | Status | ms |
|------|--------|----|
| GET /api/categories — public → 200 | ✅ PASS | 17 |
| POST /api/categories — admin → 201 | ✅ PASS | 8 |
| POST /api/categories — no token → 401 | ✅ PASS | 8 |
| DELETE /api/categories/1 — admin → 204 | ✅ PASS | 10 |
| DELETE /api/categories/1 — teacher → 403 | ✅ PASS | 10 |
| GET /api/categories/1/quizzes — public → 200 | ✅ PASS | 10 |

### ✅ Class API (14/14 passed)

| Test | Status | ms |
|------|--------|----|
| GET /api/classes — admin → 200 | ✅ PASS | 8 |
| GET /api/classes — no token → 401 | ✅ PASS | 8 |
| GET /api/classes — student → 403 | ✅ PASS | 9 |
| POST /api/classes — admin → 201 | ✅ PASS | 12 |
| GET /api/classes/1 — teacher → 200 | ✅ PASS | 12 |
| POST /api/classes/1/add-user — admin → 200 | ✅ PASS | 8 |
| POST /api/classes/1/add-quiz — teacher → 200 | ✅ PASS | 10 |
| GET /api/classes/1/quizzes — admin → 200 | ✅ PASS | 12 |
| GET /api/classes/1/students — teacher → 200 | ✅ PASS | 23 |
| POST /api/classes/1/students — admin → 200 | ✅ PASS | 11 |
| POST /api/classes/move-students — admin → 200 | ✅ PASS | 7 |
| DELETE /api/classes/1/students/2 — admin → 204 | ✅ PASS | 8 |
| PUT /api/classes/1 — teacher → 200 | ✅ PASS | 9 |
| DELETE /api/classes/1 — admin → 204 | ✅ PASS | 9 |

### ✅ Course Registration API (4/4 passed)

| Test | Status | ms |
|------|--------|----|
| POST /api/course-registrations — student → 201 | ✅ PASS | 10 |
| POST /api/course-registrations — no token → 401 | ✅ PASS | 11 |
| GET /api/course-registrations — admin → 200 | ✅ PASS | 13 |
| GET /api/course-registrations — student → 403 | ✅ PASS | 9 |

### ✅ Event Registration API (4/4 passed)

| Test | Status | ms |
|------|--------|----|
| POST /api/event-registrations — public → 201 | ✅ PASS | 8 |
| GET /api/event-registrations — admin → 200 | ✅ PASS | 9 |
| GET /api/event-registrations — no token → 401 | ✅ PASS | 8 |
| GET /api/event-registrations — student → 403 | ✅ PASS | 7 |

### ❌ Instructor API (5/6 passed)

| Test | Status | ms |
|------|--------|----|
| GET /api/instructors — public → 200 | ✅ PASS | 7 |
| GET /api/instructors/1 — public → 200 | ✅ PASS | 7 |
| POST /api/instructors — admin → 201 | ✅ PASS | 10 |
| POST /api/instructors — teacher → 403 | ✅ PASS | 7 |
| PUT /api/instructors/1 — admin → 200 | ❌ FAIL | 9 |
| DELETE /api/instructors/1 — admin → 204 | ✅ PASS | 8 |

### ✅ Dashboard API (4/4 passed)

| Test | Status | ms |
|------|--------|----|
| GET /api/dashboard/stats — admin → 200 | ✅ PASS | 14 |
| GET /api/dashboard/stats — teacher → 200 | ✅ PASS | 13 |
| GET /api/dashboard/stats — student → 403 | ✅ PASS | 11 |
| GET /api/dashboard/stats — no token → 401 | ✅ PASS | 9 |

### ✅ Assigned Quizzes API (2/2 passed)

| Test | Status | ms |
|------|--------|----|
| GET /api/assigned-quizzes — auth → 200 | ✅ PASS | 9 |
| GET /api/assigned-quizzes — no token → 401 | ✅ PASS | 7 |

### ✅ Quiz Results API (13/13 passed)

| Test | Status | ms |
|------|--------|----|
| POST /api/results/start/1 — auth → 201 | ✅ PASS | 7 |
| POST /api/results/start/1 — no token → 401 | ✅ PASS | 7 |
| POST /api/results/temp/abc-result-uuid — auth → 200 | ✅ PASS | 6 |
| POST /api/results/submit/abc-result-uuid — auth → 200 | ✅ PASS | 6 |
| GET /api/results/latest/1 — auth → 200 | ✅ PASS | 6 |
| GET /api/results/attempts/1 — auth → 200 | ✅ PASS | 5 |
| GET /api/results/user/results-stats — auth → 200 | ✅ PASS | 9 |
| GET /api/results/quiz/1/best-attempts — admin → 200 | ✅ PASS | 6 |
| GET /api/results/quiz/1/best-attempts — student → 403 | ✅ PASS | 20 |
| GET /api/results/user/1/quiz/1/best-attempt — admin → 200 | ✅ PASS | 9 |
| GET /api/results/user-summary/1 — teacher → 200 | ✅ PASS | 10 |
| GET /api/results/best-attempts/1 — auth → 200 | ✅ PASS | 11 |
| GET /api/results/user-best-attempts/1 — admin → 200 | ✅ PASS | 10 |

### ✅ SaveQuizContentsUseCase (2/2 passed)

| Test | Status | ms |
|------|--------|----|
| forwards every question, including duplicate stems, in one save request | ✅ PASS | 3 |
| rejects malformed question lists before reaching persistence | ✅ PASS | 19 |

## Role Matrix Coverage

| Role | Endpoints Tested |
|------|-----------------|
| Public (no token) | /health, /api/blog GET, /api/course GET, /api/events GET, /api/quizzes GET, /api/categories GET, /api/instructors GET, /api/event-registrations POST |
| student | /api/me, /api/assigned-quizzes, /api/results/*, /api/course-registrations POST |
| teacher | Blog/Course/Event/Quiz/Question create+update+delete, /api/classes, /api/dashboard |
| admin | All of the above + /api/users, /api/create-admin, /api/instructors write, /api/categories delete |

---
*Generated by scripts/api-test/reporter.js*