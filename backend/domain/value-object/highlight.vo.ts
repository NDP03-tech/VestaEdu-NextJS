// =====================================================
// Highlight Value Object
// =====================================================
// ⚠️ CHƯA XÁC NHẬN VỚI PRODUCT/FE:
// FindHighlightRenderer.js (FE) hiện đang đọc `question.gaps.length` để tính
// số lượng cần bôi đen, KHÔNG đọc `question.highlights`. Có 2 khả năng:
//   (a) find-highlight thực sự dùng chung field `gaps` (mỗi gap.correctAnswers
//       = các cụm text được coi là đúng khi highlight) -> Highlight VO này
//       và field `highlights` trên QuestionEntity nên được LOẠI BỎ hoàn toàn.
//   (b) FE đang bug, cần sửa lại đọc `question.highlights.length`.
//
// VO này được giữ lại theo đúng field gốc đã có trong entity cũ, nhưng
// KHÔNG NÊN coi là nguồn chân lý cuối cùng cho đến khi xác nhận lại logic
// chấm điểm find-highlight ở controller cũ (trước khi có QuestionEntity).
// Nếu xác nhận theo hướng (a): xoá file này + field `highlights` khỏi
// AnswerBlueprint/QuestionEntity, dùng `gaps` cho find-highlight luôn.
// =====================================================
import type { Reindexable } from "./shared";

export interface HighlightProps {
  index: number;
  correctAnswers: string[];
}

export interface CreateHighlightInput {
  index?: number;
  correctAnswers: string[];
}

function normalizeHighlightText(text: string): string {
  return text
    .replace(/[.,/#!$%^&*;:{}=\-_`~()[\]"]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .toLowerCase();
}

export class Highlight implements Reindexable<Highlight> {
  private constructor(readonly index: number, readonly correctAnswers: readonly string[]) {}

  static create(input: CreateHighlightInput): Highlight | null {
    const cleaned = (input.correctAnswers ?? [])
      .map((a) => String(a).trim())
      .filter(Boolean);
    if (cleaned.length === 0) return null;
    return new Highlight(input.index ?? 0, cleaned);
  }

  static reconstitute(props: HighlightProps): Highlight {
    return new Highlight(props.index, Array.isArray(props.correctAnswers) ? props.correctAnswers : []);
  }

  withIndex(index: number): Highlight {
    return new Highlight(index, this.correctAnswers);
  }

  /**
   * userHighlights: mảng { text } do FindHighlightRenderer sinh ra khi user
   * bôi đen. Chấm đúng nếu có ÍT NHẤT 1 đoạn user-highlight khớp (sau khi
   * chuẩn hoá) với 1 trong các correctAnswers của Highlight này.
   */
  grade(userHighlights: unknown, pointsPerItem: number): { earned: number; max: number; correct: boolean } {
    const list: Array<{ text?: string }> = Array.isArray(userHighlights) ? userHighlights : [];
    const targets = this.correctAnswers.map(normalizeHighlightText);
    const found = list.some((h) => targets.includes(normalizeHighlightText(h.text ?? "")));
    return { earned: found ? pointsPerItem : 0, max: pointsPerItem, correct: found };
  }

  toJSON(): HighlightProps {
    return { index: this.index, correctAnswers: [...this.correctAnswers] };
  }
}