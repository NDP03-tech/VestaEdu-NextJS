// =====================================================
// QuestionOption Value Object
// =====================================================
// Dùng cho multiple-choice / checkboxes.
//
// FIX bug cũ: validation.ts đã có sẵn normalizeQuestionOptions() với comment
// cảnh báo rõ ràng ("nếu dùng `correct` thay vì `isCorrect`, multiple-choice
// sẽ luôn chấm sai") nhưng QuestionEntity.create()/setOptions() KHÔNG BAO GIỜ
// gọi hàm đó - options được gán thẳng, không chuẩn hoá. Value Object này thay
// thế hoàn toàn, đảm bảo KHÔNG THỂ tạo option sai vì logic nằm ngay trong
// constructor/factory, không thể quên gọi như hàm rời trước đây.
//
// LƯU Ý: field bắt buộc là `isCorrect` (không phải `correct`) để khớp:
//   - Sequelize model Question.js
//   - MultipleChoiceRenderer.js / CheckboxesRenderer.js (FE đọc option.isCorrect)
// =====================================================

export interface QuestionOptionProps {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuestionOptionInput {
  text: string;
  isCorrect?: boolean;
}

export class QuestionOption {
  private constructor(
    readonly text: string,
    readonly isCorrect: boolean,
  ) {}

  static create(input: CreateQuestionOptionInput): QuestionOption | null {
    const text = String(input.text ?? "").trim();
    if (!text) return null;
    return new QuestionOption(text, Boolean(input.isCorrect));
  }

  static reconstitute(props: QuestionOptionProps): QuestionOption {
    return new QuestionOption(props.text ?? "", Boolean(props.isCorrect));
  }

  toJSON(): QuestionOptionProps {
    return { text: this.text, isCorrect: this.isCorrect };
  }
}
