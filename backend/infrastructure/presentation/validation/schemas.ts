import { z } from "zod";

/**
 * Các schema CRUD nội dung (Blog, Category, Course, Event, Instructor) chỉ
 * kiểm tra trường bắt buộc chính. Phần còn lại (kiểu dữ liệu, URL, email,
 * trạng thái...) do domain entity tự validate.
 *
 * Dùng `.passthrough()` vì validateRequest gán `req.body = schema.parse(...)`:
 * Zod mặc định XOÁ mọi trường không khai báo, nên nếu liệt kê thiếu thì
 * trường thật của entity (designation, image, startTime, host...) bị mất
 * và entity báo "is required".
 */
const looseObject = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).passthrough();

export const CreateBlogSchema = looseObject({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export const UpdateBlogSchema = looseObject({
  title: z.string().optional(),
  content: z.string().optional(),
});

export const CreateCategorySchema = looseObject({
  name: z.string().min(1, "Category name is required"),
});

export const UpdateCategorySchema = looseObject({
  name: z.string().optional(),
});

export const CreateCourseSchema = looseObject({
  name: z.string().min(1, "Course name is required"),
});

export const UpdateCourseSchema = looseObject({
  name: z.string().optional(),
});

export const CreateEventSchema = looseObject({
  title: z.string().min(1, "Event title is required"),
});

export const UpdateEventSchema = looseObject({
  title: z.string().optional(),
});

export const CreateCourseRegistrationSchema = z.object({
  courseId: z.number().int().positive("courseId is required"),
  studentId: z.number().int().positive("studentId is required"),
  notes: z.string().optional(),
});

export const CreateEventRegistrationSchema = z.object({
  eventId: z.number().int().positive("eventId is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
});

export const CreateInstructorSchema = looseObject({
  name: z.string().min(1, "Instructor name is required"),
});

export const UpdateInstructorSchema = looseObject({
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["admin", "teacher", "student"]).optional(),
});

const AttemptAnswerSchema = z.union([
  z
    .object({
      questionId: z.number().int().positive(),
      answer: z.unknown(),
    })
    .passthrough()
    .refine((value) => Object.prototype.hasOwnProperty.call(value, "answer"), {
      message: "answer is required",
    })
    .transform(({ questionId, answer }) => ({ questionId, answer })),
  z
    .object({
      question: z.number().int().positive(),
      answer: z.unknown(),
    })
    .passthrough()
    .refine((value) => Object.prototype.hasOwnProperty.call(value, "answer"), {
      message: "answer is required",
    })
    .transform(({ question, answer }) => ({ questionId: question, answer })),
]);

export const AttemptDraftSchema = z.object({
  answers: z.array(AttemptAnswerSchema),
  state: z.record(z.string(), z.unknown()).optional(),
});

export const AttemptSubmitSchema = z.object({
  answers: z.array(AttemptAnswerSchema),
});

export const AttemptGradeSchema = z.object({
  grades: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        score: z.number().finite().nonnegative(),
        feedback: z.string().max(2000).optional(),
      }),
    )
    .min(1)
    .refine(
      (grades) =>
        new Set(grades.map((grade) => grade.questionId)).size === grades.length,
      { message: "Each question may be graded only once" },
    ),
});

