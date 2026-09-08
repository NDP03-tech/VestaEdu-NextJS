// =====================================================
// Shared types & helpers cho các Value Object của Question
// =====================================================

/**
 * Chuẩn hoá giá trị để so sánh khi chấm điểm: trim + lowercase.
 * Non-string -> "" (không match với bất kỳ đáp án nào).
 */
export function norm(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export interface GradeBreakdownItem {
  label: string;
  userAnswer: unknown;
  correctAnswer: unknown;
  correct: boolean | null; // null = chưa xác định (chấm tay)
}

export interface GradeResult {
  isCorrect: boolean | null;
  score: number;
  maxScore: number;
  requiresManualGrading: boolean;
  breakdown: GradeBreakdownItem[];
}

/** Item nào có thể đổi lại index (dùng khi reindex mảng VO theo thứ tự). */
export interface Reindexable<T> {
  withIndex(index: number): T;
}

export function reindex<T extends Reindexable<T>>(items: T[]): T[] {
  return items.map((item, idx) => item.withIndex(idx));
}

export function notNull<T>(x: T | null): x is T {
  return x !== null;
}
