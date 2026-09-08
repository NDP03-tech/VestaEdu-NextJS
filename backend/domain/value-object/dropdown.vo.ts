// =====================================================
// Dropdown Value Object
// =====================================================
// FIX bug cũ: QuestionEntity trước đây gán thẳng `input.dropdowns ?? []`
// vào entity, KHÔNG trim, KHÔNG lọc rỗng, KHÔNG reindex, KHÔNG kiểm tra
// correctAnswer có nằm trong options hay không - khác hẳn Gap/HintWord đã
// có normalize riêng. Value Object này vá toàn bộ các lỗ hổng đó.
// =====================================================
import { norm, type Reindexable } from "./shared";

export interface DropdownProps {
  index: number;
  options: string[];
  correctAnswer: string;
}

export interface CreateDropdownInput {
  index?: number;
  options?: string[];
  correctAnswer: string;
}

export class Dropdown implements Reindexable<Dropdown> {
  private constructor(
    readonly index: number,
    readonly options: readonly string[],
    readonly correctAnswer: string
  ) {}

  /**
   * Tạo Dropdown mới, validate đầy đủ.
   * @returns null nếu correctAnswer rỗng (dropdown vô nghĩa, loại bỏ thay vì lưu rác)
   * @throws nếu options có giá trị nhưng KHÔNG chứa correctAnswer
   *         (học viên sẽ không bao giờ chọn được đáp án đúng qua UI -> lỗi cấu hình,
   *         nên throw ngay lúc tạo/sửa thay vì để lỗi âm thầm)
   */
  static create(input: CreateDropdownInput): Dropdown | null {
    const correctAnswer = String(input.correctAnswer ?? "").trim();
    if (!correctAnswer) return null;

    const options = (input.options ?? [])
      .map((o) => String(o).trim())
      .filter(Boolean);

    if (options.length > 0 && !options.includes(correctAnswer)) {
      throw new Error(
        `Dropdown correctAnswer "${correctAnswer}" phải nằm trong options [${options.join(", ")}]`
      );
    }

    return new Dropdown(input.index ?? 0, options, correctAnswer);
  }

  /** Tái tạo từ DB - không throw, chỉ coerce kiểu dữ liệu. */
  static reconstitute(props: DropdownProps): Dropdown {
    return new Dropdown(
      props.index,
      Array.isArray(props.options) ? props.options : [],
      props.correctAnswer ?? ""
    );
  }

  withIndex(index: number): Dropdown {
    return new Dropdown(index, this.options, this.correctAnswer);
  }

  grade(userValue: unknown, pointsPerItem: number): { earned: number; max: number; correct: boolean } {
    const ok = norm(userValue) === norm(this.correctAnswer);
    return { earned: ok ? pointsPerItem : 0, max: pointsPerItem, correct: ok };
  }

  toJSON(): DropdownProps {
    return {
      index: this.index,
      options: [...this.options],
      correctAnswer: this.correctAnswer,
    };
  }
}