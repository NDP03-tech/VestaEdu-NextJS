// =====================================================
// Gap Value Object
// =====================================================
// Đại diện cho 1 ô điền-chữ-tự-do (blank-boxes/reading/drag-drop-matching/
// generated-dropdowns đều có thể có gap). Immutable, tự validate khi tạo.
//
// FIX bug cũ: hàm normalizeGaps() trong QuestionEntity kiểm tra
// `correctAnswers.length === 0` TRƯỚC KHI trim từng phần tử, nên
// correctAnswers = ["   "] (toàn khoảng trắng) vẫn "hợp lệ" ở bước lọc,
// nhưng sau khi trim + filter(Boolean) thì thành mảng rỗng -> gap không
// bao giờ chấm đúng được. Ở đây trim TRƯỚC, kiểm tra rỗng SAU.
// =====================================================
import { norm, type Reindexable } from "./shared";

export interface GapProps {
  index: number;
  correctAnswers: string[];
  /** Vị trí ký tự bắt đầu trong questionText (FE gửi kèm khi tạo, optional). */
  position?: number;
  /** Độ dài gap tính theo ký tự (optional). */
  length?: number;
}

export interface CreateGapInput {
  index?: number;
  correctAnswers: string[];
  position?: number;
  length?: number;
}

export class Gap implements Reindexable<Gap> {
  private constructor(
    readonly index: number,
    readonly correctAnswers: readonly string[],
    readonly position?: number,
    readonly length?: number
  ) {}

  /**
   * Tạo Gap mới, validate đầy đủ.
   * @returns null nếu input không hợp lệ (caller tự lọc bỏ bằng .filter(notNull))
   */
  static create(input: CreateGapInput): Gap | null {
    const cleaned = (input.correctAnswers ?? [])
      .map((a) => String(a).trim())
      .filter(Boolean);
    if (cleaned.length === 0) return null;

    if (input.position !== undefined) {
      if (!Number.isFinite(input.position) || input.position < 0) return null;
    }
    if (input.length !== undefined) {
      if (!Number.isFinite(input.length) || input.length < 0) return null;
    }
    return new Gap(input.index ?? 0, cleaned, input.position, input.length);
  }

  /**
   * Tái tạo từ dữ liệu đã persist (DB). KHÔNG throw dù dữ liệu cũ có vấn đề -
   * tránh sập ứng dụng khi load lại record cũ; chỉ coerce kiểu dữ liệu.
   */
  static reconstitute(props: GapProps): Gap {
    return new Gap(
      props.index,
      Array.isArray(props.correctAnswers) ? props.correctAnswers : [],
      props.position,
      props.length
    );
  }

  withIndex(index: number): Gap {
    return new Gap(index, this.correctAnswers, this.position, this.length);
  }

  grade(userValue: unknown, pointsPerItem: number): { earned: number; max: number; correct: boolean } {
    const ok = this.correctAnswers.some((a) => norm(a) === norm(userValue));
    return { earned: ok ? pointsPerItem : 0, max: pointsPerItem, correct: ok };
  }

  toJSON(): GapProps {
    return {
      index: this.index,
      correctAnswers: [...this.correctAnswers],
      position: this.position,
      length: this.length,
    };
  }
}