/**
 * api.test.ts
 * Comprehensive API test suite — covers all ~50 endpoints from API_ROLE_TEST_REPORT.md
 * Uses mocked repositories (no real DB / no real server needed).
 *
 * Run:  npx jest scripts/api-test/api.test.ts --config scripts/api-test/jest.config.js
 */
import request from "supertest";
import { buildTestApp, makeToken } from "./__mocks__/app.factory";

// ─── Setup ────────────────────────────────────────────────────────────────────
const { app } = buildTestApp();

const adminToken = makeToken("admin");
const teacherToken = makeToken("teacher");
const studentToken = makeToken("student");

// ─── Helpers ──────────────────────────────────────────────────────────────────
const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

// ═══════════════════════════════════════════════════════════════════════════════
// 1. HEALTH
// ═══════════════════════════════════════════════════════════════════════════════
describe("Health", () => {
  test("GET /health → 200 OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. AUTH / USER API
// ═══════════════════════════════════════════════════════════════════════════════
describe("User API — Auth", () => {
  test("POST /api/login — valid credentials → 200 + accessToken", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "admin@test.com", password: "Admin@1234" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  test("POST /api/login — wrong password → 401", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "admin@test.com", password: "wrong" });
    expect(res.status).toBe(401);
  });

  test("POST /api/register — valid data → 201", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({ email: "new@test.com", password: "Pass@1234", role: "student" });
    expect(res.status).toBe(201);
  });

  test("POST /api/register — missing fields → 400", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({ email: "x@test.com" });
    expect(res.status).toBe(400);
  });

  test("POST /api/refresh — valid refreshToken → 200 + accessToken", async () => {
    const res = await request(app)
      .post("/api/refresh")
      .send({ refreshToken: "fake-refresh-token" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  test("POST /api/logout → 200", async () => {
    const res = await request(app)
      .post("/api/logout")
      .send({ refreshToken: "fake-refresh-token" });
    expect(res.status).toBe(200);
  });

  test("GET /api/me — with token → 200 user data", async () => {
    const res = await request(app).get("/api/me").set(auth(adminToken));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  test("GET /api/me — no token → 401", async () => {
    const res = await request(app).get("/api/me");
    expect(res.status).toBe(401);
  });
});

describe("User API — Admin CRUD", () => {
  test("POST /api/create-admin — admin → 201", async () => {
    const res = await request(app)
      .post("/api/create-admin")
      .set(auth(adminToken))
      .send({ email: "newadmin@test.com", password: "Admin@1234" });
    expect(res.status).toBe(201);
  });

  test("POST /api/create-admin — teacher → 403", async () => {
    const res = await request(app)
      .post("/api/create-admin")
      .set(auth(teacherToken))
      .send({ email: "x@test.com", password: "Pass@123" });
    expect(res.status).toBe(403);
  });

  test("GET /api/users — admin → 200", async () => {
    const res = await request(app).get("/api/users").set(auth(adminToken));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /api/users — no token → 401", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
  });

  test("GET /api/users — student → 403", async () => {
    const res = await request(app).get("/api/users").set(auth(studentToken));
    expect(res.status).toBe(403);
  });

  test("POST /api/users — admin → 201", async () => {
    const res = await request(app)
      .post("/api/users")
      .set(auth(adminToken))
      .send({ email: "u@test.com", password: "Pass@1234", role: "student" });
    expect(res.status).toBe(201);
  });

  test("PUT /api/users/1 — admin → 200", async () => {
    const res = await request(app)
      .put("/api/users/1")
      .set(auth(adminToken))
      .send({ firstName: "Updated" });
    expect(res.status).toBe(200);
  });

  test("DELETE /api/users/1 — admin → 204", async () => {
    const res = await request(app).delete("/api/users/1").set(auth(adminToken));
    expect(res.status).toBe(204);
  });

  test("GET /api/1/quizzes — auth → 200", async () => {
    const res = await request(app).get("/api/1/quizzes").set(auth(adminToken));
    expect(res.status).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. BLOG API
// ═══════════════════════════════════════════════════════════════════════════════
describe("Blog API", () => {
  test("GET /api/blog — public → 200", async () => {
    const res = await request(app).get("/api/blog");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /api/blog/1 — public → 200", async () => {
    const res = await request(app).get("/api/blog/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  test("POST /api/blog/create — admin → 201", async () => {
    const res = await request(app)
      .post("/api/blog/create")
      .set(auth(adminToken))
      .send({
        title: "New Blog",
        author: "Admin",
        authorImg: "/a.jpg",
        bannerImg: "/b.jpg",
        content: "Hello world",
      });
    expect(res.status).toBe(201);
  });

  test("POST /api/blog/create — no token → 401", async () => {
    const res = await request(app)
      .post("/api/blog/create")
      .send({
        title: "Blog",
        author: "X",
        authorImg: "/a.jpg",
        bannerImg: "/b.jpg",
        content: "Hi",
      });
    expect(res.status).toBe(401);
  });

  test("POST /api/blog/create — student → 403", async () => {
    const res = await request(app)
      .post("/api/blog/create")
      .set(auth(studentToken))
      .send({
        title: "Blog",
        author: "X",
        authorImg: "/a.jpg",
        bannerImg: "/b.jpg",
        content: "Hi",
      });
    expect(res.status).toBe(403);
  });

  test("PUT /api/blog/1 — teacher → 200", async () => {
    const res = await request(app)
      .put("/api/blog/1")
      .set(auth(teacherToken))
      .send({ title: "Updated" });
    expect(res.status).toBe(200);
  });

  test("DELETE /api/blog/1 — admin → 204", async () => {
    const res = await request(app).delete("/api/blog/1").set(auth(adminToken));
    expect(res.status).toBe(204);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. COURSE API
// ═══════════════════════════════════════════════════════════════════════════════
describe("Course API", () => {
  test("GET /api/course — public → 200", async () => {
    const res = await request(app).get("/api/course");
    expect(res.status).toBe(200);
  });

  test("GET /api/course/1 — public → 200", async () => {
    const res = await request(app).get("/api/course/1");
    expect(res.status).toBe(200);
  });

  test("POST /api/course/create — teacher → 201", async () => {
    const res = await request(app)
      .post("/api/course/create")
      .set(auth(teacherToken))
      .send({
        name: "New Course",
        title: "T",
        author: "A",
        image: "/i.jpg",
        lesson: "10",
        price: "free",
        duration: "1m",
        type: "online",
        language: "vi",
        content: "...",
        dis: "...",
      });
    expect(res.status).toBe(201);
  });

  test("POST /api/course/create — no token → 401", async () => {
    const res = await request(app)
      .post("/api/course/create")
      .send({ name: "X" });
    expect(res.status).toBe(401);
  });

  test("PUT /api/course/1 — admin → 200", async () => {
    const res = await request(app)
      .put("/api/course/1")
      .set(auth(adminToken))
      .send({ name: "Updated" });
    expect(res.status).toBe(200);
  });

  test("DELETE /api/course/1 — admin → 204", async () => {
    const res = await request(app)
      .delete("/api/course/1")
      .set(auth(adminToken));
    expect(res.status).toBe(204);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. EVENT API
// ═══════════════════════════════════════════════════════════════════════════════
describe("Event API", () => {
  test("GET /api/events — public → 200", async () => {
    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);
  });

  test("GET /api/events/1 — public → 200", async () => {
    const res = await request(app).get("/api/events/1");
    expect(res.status).toBe(200);
  });

  test("POST /api/events/create — admin → 201", async () => {
    const res = await request(app)
      .post("/api/events/create")
      .set(auth(adminToken))
      .send({
        title: "Event A",
        image: "/i.jpg",
        bannerImg: "/b.jpg",
        date: "2026-12-01",
        startTime: "09:00",
        category: "English",
        location: "HCM",
        cost: "free",
        host: "VestaEdu",
        content: "...",
        phone: "0900000000",
      });
    expect(res.status).toBe(201);
  });

  test("POST /api/events/create — student → 403", async () => {
    const res = await request(app)
      .post("/api/events/create")
      .set(auth(studentToken))
      .send({ title: "X" });
    expect(res.status).toBe(403);
  });

  test("PUT /api/events/1 — teacher → 200", async () => {
    const res = await request(app)
      .put("/api/events/1")
      .set(auth(teacherToken))
      .send({ title: "Updated" });
    expect(res.status).toBe(200);
  });

  test("DELETE /api/events/1 — admin → 204", async () => {
    const res = await request(app)
      .delete("/api/events/1")
      .set(auth(adminToken));
    expect(res.status).toBe(204);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. QUIZ API
// ═══════════════════════════════════════════════════════════════════════════════
describe("Quiz API", () => {
  test("GET /api/quizzes — public → 200", async () => {
    const res = await request(app).get("/api/quizzes");
    expect(res.status).toBe(200);
  });

  test("GET /api/quizzes/1 — public → 200", async () => {
    const res = await request(app).get("/api/quizzes/1");
    expect(res.status).toBe(200);
  });

  test("POST /api/quizzes — teacher → 201", async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .set(auth(teacherToken))
      .send({ title: "Quiz X", category: "English" });
    expect(res.status).toBe(201);
  });

  test("POST /api/quizzes — no token → 401", async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .send({ title: "Quiz X" });
    expect(res.status).toBe(401);
  });

  test("PUT /api/quizzes/1 — admin → 200", async () => {
    const res = await request(app)
      .put("/api/quizzes/1")
      .set(auth(adminToken))
      .send({ title: "Updated" });
    expect(res.status).toBe(200);
  });

  test("DELETE /api/quizzes/1 — admin → 204", async () => {
    const res = await request(app)
      .delete("/api/quizzes/1")
      .set(auth(adminToken));
    expect(res.status).toBe(204);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. QUESTION API
// ═══════════════════════════════════════════════════════════════════════════════
describe("Question API", () => {
  test("GET /api/questions — admin → 200", async () => {
    const res = await request(app).get("/api/questions").set(auth(adminToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/questions — no token → 401", async () => {
    const res = await request(app).get("/api/questions");
    expect(res.status).toBe(401);
  });

  test("GET /api/questions — student → 403", async () => {
    const res = await request(app)
      .get("/api/questions")
      .set(auth(studentToken));
    expect(res.status).toBe(403);
  });

  test("GET /api/questions/1 — teacher → 200", async () => {
    const res = await request(app)
      .get("/api/questions/1")
      .set(auth(teacherToken));
    expect(res.status).toBe(200);
  });

  test("POST /api/questions — teacher → 201", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set(auth(teacherToken))
      .send({
        quizId: 1,
        type: "multiple-choice",
        questionText: "What?",
        options: ["A", "B", "C"],
        correctAnswer: "A",
      });
    expect(res.status).toBe(201);
  });

  test("PUT /api/questions/1 — admin → 200", async () => {
    const res = await request(app)
      .put("/api/questions/1")
      .set(auth(adminToken))
      .send({ questionText: "Updated?" });
    expect(res.status).toBe(200);
  });

  test("DELETE /api/questions/1 — admin → 204", async () => {
    const res = await request(app)
      .delete("/api/questions/1")
      .set(auth(adminToken));
    expect(res.status).toBe(204);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 8. CATEGORY API
// ═══════════════════════════════════════════════════════════════════════════════
describe("Category API", () => {
  test("GET /api/categories — public → 200", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
  });

  test("POST /api/categories — admin → 201", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set(auth(adminToken))
      .send({ name: "New Cat" });
    expect(res.status).toBe(201);
  });

  test("POST /api/categories — no token → 401", async () => {
    const res = await request(app).post("/api/categories").send({ name: "X" });
    expect(res.status).toBe(401);
  });

  test("DELETE /api/categories/1 — admin → 204", async () => {
    const res = await request(app)
      .delete("/api/categories/1")
      .set(auth(adminToken));
    expect(res.status).toBe(204);
  });

  test("DELETE /api/categories/1 — teacher → 403", async () => {
    const res = await request(app)
      .delete("/api/categories/1")
      .set(auth(teacherToken));
    expect(res.status).toBe(403);
  });

  test("GET /api/categories/1/quizzes — public → 200", async () => {
    const res = await request(app).get("/api/categories/1/quizzes");
    expect(res.status).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 9. CLASS API
// ═══════════════════════════════════════════════════════════════════════════════
describe("Class API", () => {
  test("GET /api/classes — admin → 200", async () => {
    const res = await request(app).get("/api/classes").set(auth(adminToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/classes — no token → 401", async () => {
    const res = await request(app).get("/api/classes");
    expect(res.status).toBe(401);
  });

  test("GET /api/classes — student → 403", async () => {
    const res = await request(app).get("/api/classes").set(auth(studentToken));
    expect(res.status).toBe(403);
  });

  test("POST /api/classes — admin → 201", async () => {
    const res = await request(app)
      .post("/api/classes")
      .set(auth(adminToken))
      .send({ name: "Class B" });
    expect(res.status).toBe(201);
  });

  test("GET /api/classes/1 — teacher → 200", async () => {
    const res = await request(app)
      .get("/api/classes/1")
      .set(auth(teacherToken));
    expect(res.status).toBe(200);
  });

  test("POST /api/classes/1/add-user — admin → 200", async () => {
    const res = await request(app)
      .post("/api/classes/1/add-user")
      .set(auth(adminToken))
      .send({ userId: 2 });
    expect(res.status).toBe(200);
  });

  test("POST /api/classes/1/add-quiz — teacher → 200", async () => {
    const res = await request(app)
      .post("/api/classes/1/add-quiz")
      .set(auth(teacherToken))
      .send({ quizId: 1 });
    expect(res.status).toBe(200);
  });

  test("GET /api/classes/1/quizzes — admin → 200", async () => {
    const res = await request(app)
      .get("/api/classes/1/quizzes")
      .set(auth(adminToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/classes/1/students — teacher → 200", async () => {
    const res = await request(app)
      .get("/api/classes/1/students")
      .set(auth(teacherToken));
    expect(res.status).toBe(200);
  });

  test("POST /api/classes/1/students — admin → 200", async () => {
    const res = await request(app)
      .post("/api/classes/1/students")
      .set(auth(adminToken))
      .send({ studentIds: [2, 3] });
    expect(res.status).toBe(200);
  });

  test("POST /api/classes/move-students — admin → 200", async () => {
    const res = await request(app)
      .post("/api/classes/move-students")
      .set(auth(adminToken))
      .send({ fromClassId: "1", toClassId: "2", studentIds: [3] });
    expect(res.status).toBe(200);
  });

  test("DELETE /api/classes/1/students/2 — admin → 204", async () => {
    const res = await request(app)
      .delete("/api/classes/1/students/2")
      .set(auth(adminToken));
    expect(res.status).toBe(204);
  });

  test("PUT /api/classes/1 — teacher → 200", async () => {
    const res = await request(app)
      .put("/api/classes/1")
      .set(auth(teacherToken))
      .send({ name: "Updated Class" });
    expect(res.status).toBe(200);
  });

  test("DELETE /api/classes/1 — admin → 204", async () => {
    const res = await request(app)
      .delete("/api/classes/1")
      .set(auth(adminToken));
    expect(res.status).toBe(204);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 10. COURSE REGISTRATION API
// ═══════════════════════════════════════════════════════════════════════════════
describe("Course Registration API", () => {
  test("POST /api/course-registrations — student → 201", async () => {
    const res = await request(app)
      .post("/api/course-registrations")
      .set(auth(studentToken))
      .send({
        name: "Student A",
        email: "s@test.com",
        phone: "0900000003",
        courseId: 1,
        courseTitle: "IELTS",
      });
    expect(res.status).toBe(201);
  });

  test("POST /api/course-registrations — no token → 401", async () => {
    const res = await request(app)
      .post("/api/course-registrations")
      .send({
        name: "X",
        email: "x@x.com",
        phone: "123",
        courseId: 1,
        courseTitle: "Y",
      });
    expect(res.status).toBe(401);
  });

  test("GET /api/course-registrations — admin → 200", async () => {
    const res = await request(app)
      .get("/api/course-registrations")
      .set(auth(adminToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/course-registrations — student → 403", async () => {
    const res = await request(app)
      .get("/api/course-registrations")
      .set(auth(studentToken));
    expect(res.status).toBe(403);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 11. EVENT REGISTRATION API
// ═══════════════════════════════════════════════════════════════════════════════
describe("Event Registration API", () => {
  test("POST /api/event-registrations — public → 201", async () => {
    const res = await request(app)
      .post("/api/event-registrations")
      .send({
        name: "Visitor A",
        email: "v@test.com",
        phone: "0900000004",
        eventId: 1,
        eventTitle: "Seminar A",
      });
    expect(res.status).toBe(201);
  });

  test("GET /api/event-registrations — admin → 200", async () => {
    const res = await request(app)
      .get("/api/event-registrations")
      .set(auth(adminToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/event-registrations — no token → 401", async () => {
    const res = await request(app).get("/api/event-registrations");
    expect(res.status).toBe(401);
  });

  test("GET /api/event-registrations — student → 403", async () => {
    const res = await request(app)
      .get("/api/event-registrations")
      .set(auth(studentToken));
    expect(res.status).toBe(403);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 12. INSTRUCTOR API
// ═══════════════════════════════════════════════════════════════════════════════
describe("Instructor API", () => {
  test("GET /api/instructors — public → 200", async () => {
    const res = await request(app).get("/api/instructors");
    expect(res.status).toBe(200);
  });

  test("GET /api/instructors/1 — public → 200", async () => {
    const res = await request(app).get("/api/instructors/1");
    expect(res.status).toBe(200);
  });

  test("POST /api/instructors — admin → 201", async () => {
    const res = await request(app)
      .post("/api/instructors")
      .set(auth(adminToken))
      .send({ name: "Instructor X", designation: "Tutor" });
    expect(res.status).toBe(201);
  });

  test("POST /api/instructors — teacher → 403", async () => {
    const res = await request(app)
      .post("/api/instructors")
      .set(auth(teacherToken))
      .send({ name: "X", designation: "Y" });
    expect(res.status).toBe(403);
  });

  test("PUT /api/instructors/1 — admin → 200", async () => {
    const res = await request(app)
      .put("/api/instructors/1")
      .set(auth(adminToken))
      .send({ name: "Updated" });
    expect(res.status).toBe(200);
  });

  test("DELETE /api/instructors/1 — admin → 204", async () => {
    const res = await request(app)
      .delete("/api/instructors/1")
      .set(auth(adminToken));
    expect(res.status).toBe(204);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 13. DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
describe("Dashboard API", () => {
  test("GET /api/dashboard/stats — admin → 200", async () => {
    const res = await request(app)
      .get("/api/dashboard/stats")
      .set(auth(adminToken));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  test("GET /api/dashboard/stats — teacher → 200", async () => {
    const res = await request(app)
      .get("/api/dashboard/stats")
      .set(auth(teacherToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/dashboard/stats — student → 403", async () => {
    const res = await request(app)
      .get("/api/dashboard/stats")
      .set(auth(studentToken));
    expect(res.status).toBe(403);
  });

  test("GET /api/dashboard/stats — no token → 401", async () => {
    const res = await request(app).get("/api/dashboard/stats");
    expect(res.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 14. ASSIGNED QUIZZES
// ═══════════════════════════════════════════════════════════════════════════════
describe("Assigned Quizzes API", () => {
  test("GET /api/assigned-quizzes — auth → 200", async () => {
    const res = await request(app)
      .get("/api/assigned-quizzes")
      .set(auth(studentToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/assigned-quizzes — no token → 401", async () => {
    const res = await request(app).get("/api/assigned-quizzes");
    expect(res.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 15. QUIZ RESULTS
// ═══════════════════════════════════════════════════════════════════════════════
describe("Quiz Results API", () => {
  test("POST /api/results/start/1 — auth → 201", async () => {
    const res = await request(app)
      .post("/api/results/start/1")
      .set(auth(studentToken));
    expect(res.status).toBe(201);
  });

  test("POST /api/results/start/1 — no token → 401", async () => {
    const res = await request(app).post("/api/results/start/1");
    expect(res.status).toBe(401);
  });

  test("POST /api/results/temp/abc-result-uuid — auth → 200", async () => {
    const res = await request(app)
      .post("/api/results/temp/abc-result-uuid")
      .set(auth(studentToken))
      .send({ answers: [] });
    expect(res.status).toBe(200);
  });

  test("POST /api/results/submit/abc-result-uuid — auth → 200", async () => {
    const res = await request(app)
      .post("/api/results/submit/abc-result-uuid")
      .set(auth(studentToken))
      .send({ answers: [] });
    expect(res.status).toBe(200);
  });

  test("GET /api/results/latest/1 — auth → 200", async () => {
    const res = await request(app)
      .get("/api/results/latest/1")
      .set(auth(studentToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/results/attempts/1 — auth → 200", async () => {
    const res = await request(app)
      .get("/api/results/attempts/1")
      .set(auth(studentToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/results/user/results-stats — auth → 200", async () => {
    const res = await request(app)
      .get("/api/results/user/results-stats")
      .set(auth(studentToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/results/quiz/1/best-attempts — admin → 200", async () => {
    const res = await request(app)
      .get("/api/results/quiz/1/best-attempts")
      .set(auth(adminToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/results/quiz/1/best-attempts — student → 403", async () => {
    const res = await request(app)
      .get("/api/results/quiz/1/best-attempts")
      .set(auth(studentToken));
    expect(res.status).toBe(403);
  });

  test("GET /api/results/user/1/quiz/1/best-attempt — admin → 200", async () => {
    const res = await request(app)
      .get("/api/results/user/1/quiz/1/best-attempt")
      .set(auth(adminToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/results/user-summary/1 — teacher → 200", async () => {
    const res = await request(app)
      .get("/api/results/user-summary/1")
      .set(auth(teacherToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/results/best-attempts/1 — auth → 200", async () => {
    const res = await request(app)
      .get("/api/results/best-attempts/1")
      .set(auth(studentToken));
    expect(res.status).toBe(200);
  });

  test("GET /api/results/user-best-attempts/1 — admin → 200", async () => {
    const res = await request(app)
      .get("/api/results/user-best-attempts/1")
      .set(auth(adminToken));
    expect(res.status).toBe(200);
  });
});
