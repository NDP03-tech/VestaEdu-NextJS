// =====================================================
// Validation & Normalization helpers
// =====================================================
// Mọi helper ở đây đều THUẦN (pure), không phụ thuộc ORM
// hay framework. Được dùng bởi:
//   - domain/entities/*  (validate + normalize khi create/reconstitute)
//   - controllers/*      (validate trước khi vào service)
//   - utils/*            (validation phụ trợ)
// =====================================================

// ---------- Regex constants ----------

/** RFC-lite email regex: abc@def.xyz */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** URL có scheme http/https, dùng cho social links */
export const URL_REGEX = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;

/** HTTP methods được phép */
export const ALLOWED_HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
] as const;
export type HttpMethod = (typeof ALLOWED_HTTP_METHODS)[number];

// ---------- String validators ----------

/**
 * Validate tên (Category, Class, Instructor, ...).
 * Trim, không rỗng, tối đa 50 ký tự.
 */
export function validateName(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) throw new Error("Must be fill");
  if (trimmed.length > 50) throw new Error("Must be less than 50 characters");
  return trimmed;
}

/**
 * Trim + validate string bắt buộc. Throw nếu rỗng.
 * Trả về string đã được trim.
 */
export function requireNonEmpty(value: string, fieldName: string): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed) throw new Error(`${fieldName} is required`);
  return trimmed;
}

// ---------- Email validators ----------

/**
 * Normalize + validate email bắt buộc.
 * Throw nếu rỗng hoặc sai format.
 */
export function normalizeEmail(email: string): string {
  const trimmed = (email ?? "").trim().toLowerCase();
  if (!trimmed) throw new Error("Email is required");
  if (!EMAIL_REGEX.test(trimmed)) {
    throw new Error("Invalid email format");
  }
  return trimmed;
}

/**
 * Normalize + validate email tuỳ chọn.
 * Trả về null nếu input là null/undefined/rỗng.
 * Throw nếu có giá trị nhưng sai format.
 */
export function normalizeEmailOptional(
  email: string | null | undefined
): string | null {
  if (email === null || email === undefined) return null;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return null;
  if (!EMAIL_REGEX.test(trimmed)) {
    throw new Error("Invalid email format");
  }
  return trimmed;
}

// ---------- URL validator ----------

/**
 * Validate URL tuỳ chọn.
 * Trả về null nếu input là null/undefined/rỗng.
 * Throw nếu có giá trị nhưng sai format.
 */
export function validateUrlOrNull(
  url: string | null | undefined,
  fieldName: string
): string | null {
  if (url === null || url === undefined) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (!URL_REGEX.test(trimmed)) {
    throw new Error(`${fieldName} must be a valid URL`);
  }
  return trimmed;
}

// ---------- Password validator ----------

/**
 * Validate mật khẩu. Mặc định tối thiểu 6 ký tự.
 * Lưu ý: helper này KHÔNG hash - hashing là việc của persistence layer
 * (vd: Sequelize beforeCreate/beforeUpdate hook trong models/User.js).
 */
export function validatePassword(plain: string, minLength = 6): string {
  if (!plain || plain.length < minLength) {
    throw new Error(`Password must be at least ${minLength} characters`);
  }
  return plain;
}

// ---------- HTTP / Audit validators ----------

/**
 * Validate + chuẩn hoá HTTP method về upper-case.
 */
export function validateMethod(method: string): HttpMethod {
  const upper = (method ?? "").toUpperCase().trim();
  if (!(ALLOWED_HTTP_METHODS as readonly string[]).includes(upper)) {
    throw new Error(`Invalid HTTP method: ${method}`);
  }
  return upper as HttpMethod;
}

/**
 * Validate HTTP status code (100..599).
 */
export function validateStatusCode(code: number): number {
  const n = Number(code);
  if (!Number.isInteger(n) || n < 100 || n > 599) {
    throw new Error(`Invalid status code: ${code}`);
  }
  return n;
}

// ---------- Schedule normalizer ----------

/**
 * Chuẩn hoá schedule input.
 * - Nếu là array -> trả về nguyên array (nếu không phải array -> []).
 * - Nếu là string phân cách dấu phẩy -> split thành mảng các object { day }.
 * - null/undefined -> [].
 */
export interface ScheduleEntry {
  day?: string;
  time?: string;
  [key: string]: unknown;
}
export function normalizeSchedule(
  schedule: ScheduleEntry[] | string | null | undefined
): ScheduleEntry[] {
  if (!schedule) return [];
  if (Array.isArray(schedule)) return schedule;
  if (typeof schedule === "string") {
    return schedule
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ day: s }));
  }
  return [];
}

// ---------- Question helpers ----------

/** Question types theo Question model */
export const QUESTION_TYPES = [
  "blank-boxes",
  "generated-dropdowns",
  "drag-drop-matching",
  "find-highlight",
  "multiple-choice",
  "checkboxes",
  "essay",
  "description",
  "reading",
  "speaking",
] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export interface QuestionOption {
  text: string;
  /**
   * Đáp án đúng hay sai.
   * TÊN FIELD này BẮT BUỘC là `isCorrect` (không phải `correct`) vì:
   *   - Sequelize model `Question.js` thật đang dùng `isCorrect`
   *   - Frontend `MultipleChoiceRenderer.js` đọc `option.isCorrect`
   *   - QuestionEntity.gradeMultipleChoice tìm `o.isCorrect`
   * Đổi sang `correct` sẽ làm multiple-choice/checkboxes chấm sai hoàn toàn.
   */
  isCorrect?: boolean;
  [key: string]: unknown;
}

/**
 * Type guard: kiểm tra string có phải QuestionType hợp lệ không.
 */
export function isValidQuestionType(type: string): type is QuestionType {
  return (QUESTION_TYPES as readonly string[]).includes(type);
}

/**
 * Normalize options cho question:
 * - Chỉ áp dụng cho type "checkboxes" và "multiple-choice", các loại khác -> [].
 * - Lọc các option không hợp lệ, ép kiểu text/isCorrect về string/boolean.
 * - QUAN TRỌNG: Field phải là `isCorrect` (không phải `correct`) để khớp
 *   với frontend renderer + Sequelize model + QuestionEntity.grade().
 *   Nếu dùng `correct`, multiple-choice sẽ luôn chấm sai (silent bug).
 */
export function normalizeQuestionOptions(
  options: QuestionOption[] | undefined,
  type: QuestionType
): QuestionOption[] {
  if (!["checkboxes", "multiple-choice"].includes(type)) {
    return [];
  }
  if (!Array.isArray(options)) return [];
  return options
    .filter((o) => o && typeof o === "object" && o.text !== undefined)
    .map((o) => ({
      text: String(o.text),
      isCorrect: Boolean(o.isCorrect),
    }));
}
