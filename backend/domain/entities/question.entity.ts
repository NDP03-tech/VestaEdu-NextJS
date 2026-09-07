import { randomUUID } from "crypto";
import {
  QUESTION_TYPES,
  isValidQuestionType,
  type QuestionType,
  type QuestionOption as BaseQuestionOption,
} from "../../utils/validation";

// Re-export để các consumer cũ vẫn import được từ entity
export type { QuestionType } from "../../utils/validation";
export { QUESTION_TYPES, isValidQuestionType };

// Re-export QuestionOption với field isCorrect (khớp frontend + grading logic)
export type QuestionOption = BaseQuestionOption;

export interface Gap {
  index: number;
  correctAnswers: string[]; // cho phép nhiều đáp án đúng (controller: gap.correct_answers)
  /**
   * Vị trí bắt đầu của gap trong question_text (character offset).
   * Frontend (QuestionFormTest.js) gửi kèm khi tạo, dùng để render highlight.
   * Optional vì dữ liệu cũ có thể không có.
   */
  position?: number;
  /** Độ dài gap (số ký tự) - tùy chọn */
  length?: number;
}

export interface Dropdown {
  index: number;
  options?: string[];
  correctAnswer: string; // controller: dd.correct_answer
}

export interface HintWord {
  index: number;
  word: string; // controller: hw.word — KHÔNG phải string[] như bản cũ
  /**
   * Gợi ý đi kèm (frontend QuestionFormTest.js gửi: { word, hint }).
   * Hiện tại không dùng để chấm, chỉ để hiển thị gợi ý cho học viên.
   */
  hint?: string;
}

export interface Highlight {
  index: number;
  correctAnswers: string[]; // các cụm text được coi là đúng khi user highlight
}

const GAP_BASED_TYPES: QuestionType[] = [
  "blank-boxes",
  "reading",
  "drag-drop-matching",
  "generated-dropdowns",
];

const MANUAL_GRADING_TYPES: QuestionType[] = [
  "essay",
  "description",
  "speaking",
];

// ----------------------------------------------------------------
// Grading result — trả về đủ thông tin để controller / UI dùng lại
// mà không phải tự tính toán thêm lần nào nữa.
// ----------------------------------------------------------------
export interface GradeBreakdownItem {
  label: string;
  userAnswer: unknown;
  correctAnswer: unknown;
  correct: boolean | null; // null = chưa xác định (chấm tay)
}

export interface GradeResult {
  isCorrect: boolean | null; // null = cần chấm tay
  score: number;
  maxScore: number;
  requiresManualGrading: boolean;
  breakdown: GradeBreakdownItem[];
}

// ----------------------------------------------------------------
// Props
// ----------------------------------------------------------------
interface QuestionProps {
  id: number;
  quizId: number; // FK tới QuizEntity.id (integer PK)
  order: number;
  questionType: QuestionType;
  questionText: string;
  readingContent: string | null;
  points: number;
  explanation: string | null;
  options: QuestionOption[];
  gaps: Gap[];
  dropdowns: Dropdown[];
  hintWords: HintWord[];
  highlights: Highlight[];
  correctAnswer: unknown; // fallback cho type tự do / legacy
  createdAt: Date;
  updatedAt: Date;
}

interface CreateQuestionProps {
  quizId: number;
  order?: number;
  questionType: QuestionType;
  questionText: string;
  readingContent?: string | null;
  points?: number;
  explanation?: string | null;
  options?: QuestionOption[];
  gaps?: Gap[];
  dropdowns?: Dropdown[];
  hintWords?: HintWord[];
  highlights?: Highlight[];
  correctAnswer?: unknown;
}

function norm(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeHighlightText(text: string): string {
  return text
    .replace(/[.,/#!$%^&*;:{}=\-_`~()[\]"]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .toLowerCase();
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
    const now = new Date();
    return new QuestionEntity({
      id: 0, // DB tự sinh integer PK
      quizId: input.quizId,
      order: input.order ?? 0,
      questionType: input.questionType,
      questionText: input.questionText.trim(),
      readingContent: input.readingContent?.trim() || null,
      points: Math.max(0, Number(input.points ?? 1)),
      explanation: input.explanation?.trim() || null,
      options: input.options ?? [],
      gaps: QuestionEntity.normalizeGaps(input.gaps ?? []),
      dropdowns: input.dropdowns ?? [],
      hintWords: QuestionEntity.normalizeHintWords(input.hintWords ?? []),
      highlights: input.highlights ?? [],
      correctAnswer: input.correctAnswer ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: QuestionProps): QuestionEntity {
    return new QuestionEntity({ ...props });
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
  get options(): QuestionOption[] {
    return [...this.props.options];
  }
  get gaps(): Gap[] {
    return [...this.props.gaps];
  }
  get dropdowns(): Dropdown[] {
    return [...this.props.dropdowns];
  }
  get hintWords(): HintWord[] {
    return [...this.props.hintWords];
  }
  get highlights(): Highlight[] {
    return [...this.props.highlights];
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

  get requiresManualGrading(): boolean {
    return MANUAL_GRADING_TYPES.includes(this.props.questionType);
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  // ===== Business methods (chỉnh sửa nội dung câu hỏi) =====
  updateText(text: string): void {
    if (!text?.trim()) throw new Error("questionText cannot be empty");
    this.props.questionText = text.trim();
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

  setOptions(options: QuestionOption[]): void {
    this.props.options = options;
    this.touch();
  }

  setGaps(gaps: Gap[]): void {
    this.props.gaps = gaps;
    this.touch();
  }

  setDropdowns(dropdowns: Dropdown[]): void {
    this.props.dropdowns = dropdowns;
    this.touch();
  }

  setHintWords(hintWords: HintWord[]): void {
    this.props.hintWords = hintWords;
    this.touch();
  }

  setHighlights(highlights: Highlight[]): void {
    this.props.highlights = highlights;
    this.touch();
  }

  changeType(newType: QuestionType): void {
    this.props.questionType = newType;
    // Dọn dữ liệu không còn liên quan tới loại câu hỏi mới,
    // tránh để lại "rác" gây sai khi chấm điểm hoặc hiển thị lại.
    if (!GAP_BASED_TYPES.includes(newType)) {
      this.props.gaps = [];
      this.props.dropdowns = [];
      this.props.hintWords = [];
    }
    if (newType !== "find-highlight") this.props.highlights = [];
    if (newType !== "multiple-choice" && newType !== "checkboxes") {
      this.props.options = [];
    }
    this.touch();
  }

  // ================================================================
  // CHẤM ĐIỂM — nguồn chân lý duy nhất.
  // Controller / service KHÔNG được tự viết lại logic so khớp này ở
  // bất kỳ đâu khác (submit, xem lại kết quả, export báo cáo...).
  // ================================================================
  grade(userAnswer: unknown): GradeResult {
    if (this.requiresManualGrading) {
      return {
        isCorrect: null,
        score: 0,
        maxScore: 0,
        requiresManualGrading: true,
        breakdown: [
          {
            label: `${this.props.questionType} - chấm tay`,
            userAnswer: typeof userAnswer === "string" ? userAnswer : "",
            correctAnswer: "(manual grading)",
            correct: null,
          },
        ],
      };
    }

    if (GAP_BASED_TYPES.includes(this.props.questionType)) {
      return this.gradeGapBased(userAnswer);
    }

    switch (this.props.questionType) {
      case "multiple-choice":
        return this.gradeMultipleChoice(userAnswer);
      case "checkboxes":
        return this.gradeCheckboxes(userAnswer);
      case "find-highlight":
        return this.gradeHighlight(userAnswer);
      default:
        return this.gradeDefault(userAnswer);
    }
  }

  private gradeGapBased(userAnswer: unknown): GradeResult {
    const raw = (userAnswer ?? {}) as Record<string, unknown>;
    const points = this.props.points || 1;
    let earned = 0;
    let max = 0;
    const breakdown: GradeBreakdownItem[] = [];

    this.props.gaps.forEach((gap, idx) => {
      max += points;
      const userVal = raw[`gap_${idx}`];
      const correctAnswers = gap.correctAnswers.map(norm);
      const ok = correctAnswers.includes(norm(userVal));
      if (ok) earned += points;
      breakdown.push({
        label: `Gap ${idx + 1}`,
        userAnswer: userVal ?? "",
        correctAnswer: gap.correctAnswers[0] ?? "",
        correct: ok,
      });
    });

    this.props.dropdowns.forEach((dd, idx) => {
      max += points;
      const userVal = raw[`dropdown_${idx}`];
      const ok = norm(userVal) === norm(dd.correctAnswer);
      if (ok) earned += points;
      breakdown.push({
        label: `Dropdown ${idx + 1}`,
        userAnswer: userVal ?? "",
        correctAnswer: dd.correctAnswer,
        correct: ok,
      });
    });

    this.props.hintWords.forEach((hw, idx) => {
      max += points;
      const userVal = raw[`hint_${idx}`];
      const ok = norm(userVal) === norm(hw.word);
      if (ok) earned += points;
      breakdown.push({
        label: `Hint ${idx + 1}`,
        userAnswer: userVal ?? "",
        correctAnswer: hw.word,
        correct: ok,
      });
    });

    return {
      isCorrect: max > 0 && earned === max,
      score: earned,
      maxScore: max,
      requiresManualGrading: false,
      breakdown,
    };
  }

  private gradeMultipleChoice(userAnswer: unknown): GradeResult {
    const correctOption = this.props.options.find((o) => o.isCorrect);
    const ok = norm(userAnswer) === norm(correctOption?.text);
    return {
      isCorrect: ok,
      score: ok ? this.props.points : 0,
      maxScore: this.props.points,
      requiresManualGrading: false,
      breakdown: [
        {
          label: "Answer",
          userAnswer,
          correctAnswer: correctOption?.text ?? null,
          correct: ok,
        },
      ],
    };
  }

  private gradeCheckboxes(userAnswer: unknown): GradeResult {
    const userSet = new Set(
      Array.isArray(userAnswer) ? userAnswer.map((v) => Number(v)) : [],
    );
    const correctIndexes = this.props.options
      .map((o, idx) => (o.isCorrect ? idx : -1))
      .filter((idx) => idx !== -1);

    const points = this.props.points || 1;
    const max = correctIndexes.length * points;
    let earned = 0;
    const breakdown: GradeBreakdownItem[] = [];

    this.props.options.forEach((opt, idx) => {
      const shouldSelect = opt.isCorrect;
      const wasSelected = userSet.has(idx);
      if (shouldSelect && wasSelected) earned += points;
      breakdown.push({
        label: opt.text,
        userAnswer: wasSelected,
        correctAnswer: shouldSelect,
        correct: shouldSelect === wasSelected,
      });
    });

    return {
      isCorrect: max > 0 && earned === max,
      score: earned,
      maxScore: max,
      requiresManualGrading: false,
      breakdown,
    };
  }

  private gradeHighlight(userAnswer: unknown): GradeResult {
    const userHighlights: Array<{ text?: string }> = Array.isArray(userAnswer)
      ? userAnswer
      : [];
    const points = this.props.points || 1;
    const max = this.props.highlights.length * points;
    let earned = 0;
    const usedIndexes = new Set<number>();
    const breakdown: GradeBreakdownItem[] = [];

    this.props.highlights.forEach((h, hIdx) => {
      const targets = h.correctAnswers.map(normalizeHighlightText);
      const matchIdx = userHighlights.findIndex(
        (uh, i) =>
          !usedIndexes.has(i) &&
          targets.includes(normalizeHighlightText(uh.text ?? "")),
      );
      const found = matchIdx !== -1;
      if (found) {
        usedIndexes.add(matchIdx);
        earned += points;
      }
      breakdown.push({
        label: `Highlight ${hIdx + 1}`,
        userAnswer: found ? userHighlights[matchIdx].text : "",
        correctAnswer: h.correctAnswers[0] ?? "",
        correct: found,
      });
    });

    return {
      isCorrect: max > 0 && earned === max,
      score: earned,
      maxScore: max,
      requiresManualGrading: false,
      breakdown,
    };
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

  toJSON(): QuestionProps {
    return { ...this.props };
  }

  // ===== Static normalizers (chạy trong create()) =====
  /**
   * Chuẩn hoá Gap: ép position/length về số >= 0, ép correctAnswers thành string[].
   * Loại bỏ gap không có correctAnswers hợp lệ HOẶC có position/length không hợp lệ.
   * Gán lại index theo thứ tự 0..n-1 (frontend có thể gửi index lộn xộn).
   */
  static normalizeGaps(gaps: Gap[]): Gap[] {
    const filtered = gaps
      .filter((g) => {
        // Phải có correctAnswers hợp lệ
        if (!Array.isArray(g.correctAnswers) || g.correctAnswers.length === 0) return false;
        // Nếu có position thì phải là số >= 0
        if (g.position !== undefined) {
          if (typeof g.position !== "number" || !Number.isFinite(g.position) || g.position < 0) {
            return false;
          }
        }
        // Nếu có length thì phải là số >= 0
        if (g.length !== undefined) {
          if (typeof g.length !== "number" || !Number.isFinite(g.length) || g.length < 0) {
            return false;
          }
        }
        return true;
      })
      .map((g) => ({
        index: g.index,
        correctAnswers: g.correctAnswers.map((a) => String(a).trim()).filter(Boolean),
        position: typeof g.position === "number" ? g.position : undefined,
        length: typeof g.length === "number" ? g.length : undefined,
      }));
    // Gán lại index tuần tự để renderer dùng gap_0, gap_1, ... đúng thứ tự
    return filtered.map((g, idx) => ({
      index: idx,
      correctAnswers: g.correctAnswers,
      position: g.position,
      length: g.length,
    }));
  }

  /**
   * Chuẩn hoá HintWord: trim word, hint optional, loại bỏ word rỗng.
   * Gán lại index tuần tự.
   */
  static normalizeHintWords(items: HintWord[]): HintWord[] {
    const filtered = items
      .map((h) => {
        const word = String(h.word ?? "").trim();
        if (!word) return null;
        const norm: HintWord = { index: h.index, word };
        if (h.hint) {
          const trimmed = h.hint.trim();
          if (trimmed) norm.hint = trimmed;
        }
        return norm;
      })
      .filter((x): x is HintWord => x !== null);
    return filtered.map((h, idx) => ({ ...h, index: idx }));
  }
}
