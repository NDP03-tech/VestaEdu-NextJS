// =====================================================
// QuestionEntity (viết lại)
// =====================================================
// So với bản cũ:
//   1. gaps/dropdowns/hintWords/highlights/options được gộp vào 1
//      AnswerBlueprint duy nhất (xem answer-blueprint.vo.ts) thay vì 5 mảng
//      rời rạc validate không đồng nhất.
//   2. changeType() KHÔNG còn dọn dẹp field theo questionType - mọi loại câu
//      hỏi đều có thể trộn tự do gap/dropdown/hint/highlight/option theo yêu
//      cầu nghiệp vụ. questionType giờ chỉ quyết định layout/widget hiển thị
//      ở FE (vd: generated-dropdowns render "gap thường" thành dropdown tự
//      sinh, blank-boxes render thành input tự do - cùng dữ liệu Gap[] như
//      nhau, khác nhau ở cách FE vẽ).
//   3. create()/update() BẮT BUỘC gọi AnswerBlueprint.assertMatchesText() để
//      đảm bảo số lượng gap/dropdown/hint khớp đúng số marker .cloze trong
//      questionText - vì FE tính key theo vị trí DOM, không dùng field index.
//   4. grade() không còn switch(questionType) - chấm gộp theo field nào có
//      dữ liệu, qua AnswerBlueprint.grade(). Chỉ còn tách riêng nhánh
//      "chấm tay" (essay/description/speaking) vì các type này không có cấu
//      trúc để tự động chấm.
// =====================================================
import {
  QUESTION_TYPES,
  isValidQuestionType,
  type QuestionType,
} from "../../utils/validation";
import {
  AnswerBlueprint,
  type AnswerBlueprintProps,
  type CreateAnswerBlueprintInput,
} from "../value-object/answer-blueprint.vo";
import type { GradeResult } from "../value-object/shared";
import type { GapProps, CreateGapInput } from "../value-object/gap.vo";
import type {
  DropdownProps,
  CreateDropdownInput,
} from "../value-object/dropdown.vo";
import type {
  HintWordProps,
  CreateHintWordInput,
} from "../value-object/hint-word.vo";
import type {
  HighlightProps,
  CreateHighlightInput,
} from "../value-object/highlight.vo";
import type {
  QuestionOptionProps,
  CreateQuestionOptionInput,
} from "../value-object/question-option.vo";

export type { QuestionType } from "../../utils/validation";
export { QUESTION_TYPES, isValidQuestionType };

// Re-export để consumer cũ (controller, service...) vẫn import được các type
// quen thuộc từ entity thay vì phải biết đường dẫn value-object/.
export type { GapProps as Gap } from "../value-object/gap.vo";
export type { DropdownProps as Dropdown } from "../value-object/dropdown.vo";
export type { HintWordProps as HintWord } from "../value-object/hint-word.vo";
export type { HighlightProps as Highlight } from "../value-object/highlight.vo";
export type { QuestionOptionProps as QuestionOption } from "../value-object/question-option.vo";

const MANUAL_GRADING_TYPES: QuestionType[] = [
  "essay",
  "description",
  "speaking",
];

// ----------------------------------------------------------------
// Props
// ----------------------------------------------------------------
export interface QuestionProps {
  id: number;
  quizId: number;
  order: number;
  questionType: QuestionType;
  questionText: string;
  readingContent: string | null;
  points: number;
  explanation: string | null;
  answerBlueprint: AnswerBlueprintProps;
  /** Fallback cho type tự do / legacy, khi AnswerBlueprint rỗng. */
  correctAnswer: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuestionProps {
  quizId: number | string;
  order?: number;
  questionType: QuestionType;
  questionText: string;
  readingContent?: string | null;
  points?: number;
  explanation?: string | null;
  answerBlueprint?: CreateAnswerBlueprintInput;
  gaps?: CreateGapInput[];
  dropdowns?: CreateDropdownInput[];
  hintWords?: CreateHintWordInput[];
  highlights?: CreateHighlightInput[];
  options?: CreateQuestionOptionInput[];
  correctAnswer?: unknown;
  /**
   * Bỏ qua kiểm tra assertMatchesText (chỉ dùng cho import dữ liệu cũ / test).
   * KHÔNG dùng cờ này trong luồng tạo câu hỏi bình thường từ admin panel.
   */
  skipClozeValidation?: boolean;
}

export interface ReconstituteQuestionProps {
  id: number;
  quizId: number | string;
  order?: number;
  questionType: QuestionType;
  questionText: string;
  readingContent?: string | null;
  points?: number;
  explanation?: string | null;
  answerBlueprint?: AnswerBlueprintProps;
  gaps?: GapProps[];
  dropdowns?: DropdownProps[];
  hintWords?: HintWordProps[];
  highlights?: HighlightProps[];
  options?: QuestionOptionProps[];
  correctAnswer?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------------------------------
// Entity
// ----------------------------------------------------------------
export class QuestionEntity {
  private constructor(private props: QuestionProps) {}

  // ===== Factory =====
  static create(input: CreateQuestionProps): QuestionEntity {
    if (!input.questionText?.trim()) {
      throw new Error("questionText cannot be empty");
    }
    if (!isValidQuestionType(input.questionType)) {
      throw new Error(`Invalid question type: ${input.questionType}`);
    }

    const questionText = input.questionText.trim();
    const blueprintInput: CreateAnswerBlueprintInput =
      input.answerBlueprint ?? {
        gaps: input.gaps,
        dropdowns: input.dropdowns,
        hintWords: input.hintWords,
        highlights: input.highlights,
        options: input.options,
      };
    const blueprint = AnswerBlueprint.create(blueprintInput);

    if (!input.skipClozeValidation) {
      blueprint.assertMatchesText(questionText);
    }

    const now = new Date();
    return new QuestionEntity({
      id: 0, // DB tự sinh integer PK
      quizId: Math.max(0, Number(input.quizId) || 0),
      order: Math.max(0, Number(input.order ?? 0)),
      questionType: input.questionType,
      questionText,
      readingContent: input.readingContent?.trim() || null,
      points: Math.max(0, Number(input.points ?? 1)),
      explanation: input.explanation?.trim() || null,
      answerBlueprint: blueprint.toJSON(),
      correctAnswer: input.correctAnswer ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: ReconstituteQuestionProps): QuestionEntity {
    const blueprintProps: AnswerBlueprintProps = props.answerBlueprint ?? {
      gaps: props.gaps,
      dropdowns: props.dropdowns,
      hintWords: props.hintWords,
      highlights: props.highlights,
      options: props.options,
    };
    return new QuestionEntity({
      id: Number(props.id) || 0,
      quizId: Math.max(0, Number(props.quizId) || 0),
      order: Math.max(0, Number(props.order ?? 0)),
      questionType: props.questionType,
      questionText: props.questionText,
      readingContent: props.readingContent?.trim() || null,
      points: Math.max(0, Number(props.points ?? 0)),
      explanation: props.explanation?.trim() || null,
      answerBlueprint: blueprintProps,
      correctAnswer: props.correctAnswer ?? null,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  // ===== Getters =====
  get id() {
    return this.props.id;
  }
  get quizId() {
    return this.props.quizId;
  }
  get order() {
    return this.props.order;
  }
  get questionType() {
    return this.props.questionType;
  }
  get questionText() {
    return this.props.questionText;
  }
  get readingContent() {
    return this.props.readingContent;
  }
  get points() {
    return this.props.points;
  }
  get explanation() {
    return this.props.explanation;
  }
  get correctAnswer() {
    return this.props.correctAnswer;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  /** VO sống, dùng để đọc/chấm điểm - không dùng để mutate trực tiếp. */
  get answerBlueprint(): AnswerBlueprint {
    return AnswerBlueprint.reconstitute(this.props.answerBlueprint);
  }

  // Getters tiện dụng cho consumer chỉ cần đọc từng phần (giữ tương thích
  // với code cũ đang gọi question.gaps / question.dropdowns / ...).
  get gaps() {
    return this.answerBlueprint.gaps.map((g) => g.toJSON());
  }
  get dropdowns() {
    return this.answerBlueprint.dropdowns.map((d) => d.toJSON());
  }
  get hintWords() {
    return this.answerBlueprint.hintWords.map((h) => h.toJSON());
  }
  get highlights() {
    return this.answerBlueprint.highlights.map((h) => h.toJSON());
  }
  get options() {
    return this.answerBlueprint.options.map((o) => o.toJSON());
  }

  get requiresManualGrading(): boolean {
    return MANUAL_GRADING_TYPES.includes(this.props.questionType);
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  // ===== Business methods =====
  updateText(text: string, opts: { skipClozeValidation?: boolean } = {}): void {
    if (!text?.trim()) throw new Error("questionText cannot be empty");
    const trimmed = text.trim();
    if (!opts.skipClozeValidation) {
      this.answerBlueprint.assertMatchesText(trimmed);
    }
    this.props.questionText = trimmed;
    this.touch();
  }

  setOrder(order: number): void {
    this.props.order = Math.max(0, Number(order) || 0);
    this.touch();
  }

  setPoints(points: number): void {
    this.props.points = Math.max(0, Number(points) || 0);
    this.touch();
  }

  setReadingContent(content: string | null): void {
    this.props.readingContent = content?.trim() || null;
    this.touch();
  }

  setExplanation(explanation: string | null): void {
    this.props.explanation = explanation?.trim() || null;
    this.touch();
  }

  /**
   * Thay toàn bộ answerBlueprint (gap/dropdown/hint/highlight/option).
   * Mặc định validate khớp questionText hiện tại - truyền skipValidation=true
   * chỉ khi bạn chắc chắn sẽ gọi updateText() ngay sau đó với text tương ứng.
   */
  setAnswerBlueprint(
    input: CreateAnswerBlueprintInput,
    skipValidation = false,
  ): void {
    const blueprint = AnswerBlueprint.create(input);
    if (!skipValidation) {
      blueprint.assertMatchesText(this.props.questionText);
    }
    this.props.answerBlueprint = blueprint.toJSON();
    this.touch();
  }

  /**
   * Đổi loại câu hỏi. KHÔNG xoá gap/dropdown/hint/highlight/option như bản
   * cũ - mọi field độc lập với questionType, giữ nguyên toàn bộ dữ liệu khi
   * đổi type (theo đúng yêu cầu "trộn tự do" của khách hàng).
   */
  changeType(newType: QuestionType): void {
    if (!isValidQuestionType(newType)) {
      throw new Error(`Invalid question type: ${newType}`);
    }
    this.props.questionType = newType;
    this.touch();
  }

  setCorrectAnswer(value: unknown): void {
    this.props.correctAnswer = value ?? null;
    this.touch();
  }

  // ================================================================
  // CHẤM ĐIỂM — nguồn chân lý duy nhất, KHÔNG viết lại logic so khớp ở
  // controller/service.
  //
  // Không còn switch(questionType): chấm gộp theo field nào có dữ liệu
  // trong answerBlueprint. essay/description/speaking luôn cần chấm tay vì
  // không có cấu trúc để so khớp tự động.
  // ================================================================
  grade(rawAnswer: unknown): GradeResult {
    if (this.requiresManualGrading) {
      return {
        isCorrect: null,
        score: 0,
        maxScore: 0,
        requiresManualGrading: true,
        breakdown: [
          {
            label: `${this.props.questionType} - chấm tay`,
            userAnswer: typeof rawAnswer === "string" ? rawAnswer : "",
            correctAnswer: "(manual grading)",
            correct: null,
          },
        ],
      };
    }

    const blueprint = this.answerBlueprint;

    if (blueprint.isEmpty()) {
      return this.gradeDefault(rawAnswer);
    }

    return blueprint.grade(
      (rawAnswer ?? {}) as Record<string, unknown>,
      this.props.points || 1,
    );
  }

  private gradeDefault(userAnswer: unknown): GradeResult {
    const ok =
      JSON.stringify(userAnswer) === JSON.stringify(this.props.correctAnswer);
    return {
      isCorrect: ok,
      score: ok ? this.props.points : 0,
      maxScore: this.props.points,
      requiresManualGrading: false,
      breakdown: [
        {
          label: "Answer",
          userAnswer,
          correctAnswer: this.props.correctAnswer,
          correct: ok,
        },
      ],
    };
  }

  toJSON(): QuestionProps & {
    gaps: GapProps[];
    dropdowns: DropdownProps[];
    hintWords: HintWordProps[];
    highlights: HighlightProps[];
    options: QuestionOptionProps[];
  } {
    return {
      ...this.props,
      answerBlueprint: { ...this.props.answerBlueprint },
      gaps: this.gaps,
      dropdowns: this.dropdowns,
      hintWords: this.hintWords,
      highlights: this.highlights,
      options: this.options,
    };
  }
}
