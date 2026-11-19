export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "VestaEdu API Documentation",
    version: "1.0.0",
    description: "API Documentation for VestaEdu backend services (Clean Architecture & TypeORM)",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Service Health Check",
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "OK" },
                    timestamp: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/login": {
      post: {
        summary: "User Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful with tokens" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/register": {
      post: {
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "firstName", "lastName"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  role: { type: "string", enum: ["admin", "teacher", "student"] },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/blog": {
      get: {
        summary: "Get list of blog posts",
        responses: { "200": { description: "List of posts" } },
      },
      post: {
        summary: "Create a blog post (Admin/Teacher)",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Post created" } },
      },
    },
    "/api/categories": {
      get: {
        summary: "Get all categories",
        responses: { "200": { description: "List of categories" } },
      },
      post: {
        summary: "Create a category (Admin/Teacher)",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Category created" } },
      },
    },
    "/api/course": {
      get: {
        summary: "Get all courses",
        responses: { "200": { description: "List of courses" } },
      },
      post: {
        summary: "Create a course (Admin/Teacher)",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Course created" } },
      },
    },
    "/api/events": {
      get: {
        summary: "Get all events",
        responses: { "200": { description: "List of events" } },
      },
      post: {
        summary: "Create an event (Admin/Teacher)",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Event created" } },
      },
    },
    "/api/instructors": {
      get: {
        summary: "Get all instructors",
        responses: { "200": { description: "List of instructors" } },
      },
      post: {
        summary: "Create an instructor (Admin)",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Instructor created" } },
      },
    },
    "/api/quizzes": {
      get: {
        summary: "Get all quizzes",
        responses: { "200": { description: "List of quizzes" } },
      },
    },
    "/api/quizzes/{quizId}/contents": {
      put: {
        summary: "Save quiz metadata and question changes atomically (Admin/Teacher)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "quizId",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["quiz", "questions"],
                properties: {
                  quiz: {
                    type: "object",
                    required: ["version"],
                    properties: {
                      title: { type: "string" },
                      status: {
                        type: "string",
                        enum: ["draft", "published", "archived"],
                      },
                      version: { type: "integer", minimum: 1 },
                    },
                  },
                  questions: {
                    type: "array",
                    items: { type: "object" },
                    description: "Changed/new questions in display order; duplicate text is allowed.",
                  },
                  deletedQuestionIds: {
                    type: "array",
                    items: { type: "integer", minimum: 1 },
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Quiz and all questions after the save" },
          "400": { description: "Invalid quiz or question data" },
          "404": { description: "Quiz or question not found" },
          "409": {
            description: "The quiz was changed by another editor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string" } },
                },
              },
            },
          },
        },
      },
    },
    "/api/questions/by-quiz/{quizId}": {
      get: {
        summary: "Get quiz questions using a student-safe response",
        description:
          "Students can retrieve questions only for published quizzes. Their response omits correct answers and explanations; teachers and admins receive authoring data.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "quizId",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "200": { description: "Quiz questions" },
          "400": { description: "quizId must be a positive integer" },
          "401": { description: "Authentication required" },
          "404": { description: "Quiz not found or not published" },
        },
      },
    },
    "/api/results/start/{quizId}": {
      post: {
        summary: "Start or resume a quiz attempt",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "quizId",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "200": { description: "Attempt created or resumed" },
          "404": { description: "Quiz not found or not published" },
          "409": {
            description: "Exam start is blocked by its configured attempt gates",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    code: {
                      type: "string",
                      enum: ["ALREADY_PASSED", "NO_ATTEMPTS_LEFT"],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/classes": {
      get: {
        summary: "Get all classes (Admin/Teacher)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "List of classes" } },
      },
      post: {
        summary: "Create a class (Admin/Teacher)",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Class created" } },
      },
    },
  },
};

