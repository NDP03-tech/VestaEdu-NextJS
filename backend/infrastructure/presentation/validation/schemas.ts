import { z } from "zod";

export const CreateBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().optional(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export const UpdateBlogSchema = CreateBlogSchema.partial();

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export const CreateCourseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  instructorId: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateCourseSchema = CreateCourseSchema.partial();

export const CreateEventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().optional(),
  eventDate: z.string().or(z.date()).optional(),
  location: z.string().optional(),
  capacity: z.number().int().positive().optional(),
});

export const UpdateEventSchema = CreateEventSchema.partial();

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

export const CreateInstructorSchema = z.object({
  name: z.string().min(1, "Instructor name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  specialization: z.string().optional(),
});

export const UpdateInstructorSchema = CreateInstructorSchema.partial();

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

