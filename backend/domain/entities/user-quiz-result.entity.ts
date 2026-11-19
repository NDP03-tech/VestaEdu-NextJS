import { randomUUID } from "crypto";
import { QuestionEntity } from "./question.entity";

// ----------------------------------------------------------------
// QuizAnswer — khớp field thật đang lưu trong DB/controller
// (question -> answer, kèm kết quả chấm điểm của từng câu).
// Bản cũ dùng {questionId, value} là SAI so với dữ liệu thật.
// ----------------------------------------------------------------
export interface QuizAnswer {
  questionId: number; // khớp với QuestionEntity.id (integer PK từ Sequelize)
  answer: unknown;
  isCorrect: boolean | null; // null = cần chấm tay (essay/description/speaking)
  score: number;
  requiresManualGrading: boolean;
  graderFeedback?: string | null;
}

export interface RawAnswerInput {
  questionId: number; // integer PK, khớp với Question.id
  answer: unknown;
}

interface UserQuizResultProps {
  id: number;
  userId: number;
  quizId: number; // FK tới QuizEntity.id (integer PK)
  attemptNumber: number;
  quizVersion: number | null;
  deadline: Date | null;
  submittedLate?: boolean;
  state: Record<string, unknown>;
  /**
   * ⚠️  Nguồn chân lý cho attempt là AttemptCounterEntity (xem {@link AttemptCounterEntity}).
   *      `attemptNumber` ở đây chỉ là snapshot tại lúc submit,
   *      dùng để hiển thị, KHÔNG dùng để quyết định tăng/reset attempt.
   *      Khi reset attempt, hãy reset AttemptCounter trước.
   */
  answers: QuizAnswer[];
  score: number; // phần trăm 0-100, tự động bỏ qua câu chấm tay khỏi mẫu số
  passed: boolean;
  needsManualGrading: boolean; // true nếu còn câu essay/speaking chưa chấm
  startedAt: Date;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserQuizResultProps {
  userId: number;
  quizId: number;
  attemptNumber: number;
  quizVersion?: number | null;
  deadline?: Date | null;
  state?: Record<string, unknown>;
}

export class UserQuizResultEntity {
  private constructor(private props: UserQuizResultProps) {}

  // ===== Factory =====
  static create(input: CreateUserQuizResultProps): UserQuizResultEntity {
    const now = new Date();
    if (input.attemptNumber < 1) {
      throw new Error("attemptNumber must be >= 1");
    }
    return new UserQuizResultEntity({
      id: 0, // DB tự sinh integer PK
      userId: Number(input.userId),
      quizId: input.quizId,
      attemptNumber: input.attemptNumber,
      quizVersion: input.quizVersion ?? null,
      deadline: input.deadline ?? null,
      submittedLate: false,
      state: input.state ?? {},
      answers: [],
      score: 0,
      passed: false,
      needsManualGrading: false,
      startedAt: now,
      submittedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: UserQuizResultProps): UserQuizResultEntity {
    return new UserQuizResultEntity({ ...props });
  }

  // ===== Getters =====
  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get quizId() {
    return this.props.quizId;
  }
  get attemptNumber() {
    return this.props.attemptNumber;
  }
  get quizVersion() {
    return this.props.quizVersion;
  }
  get deadline() {
    return this.props.deadline;
  }
  get submittedLate(): boolean {
    return this.props.submittedLate ?? false;
  }
  get state(): Record<string, unknown> {
    return { ...this.props.state };
  }
  get answers(): QuizAnswer[] {
    return [...this.props.answers];
  }
  get score() {
    return this.props.score;
  }
  get passed() {
    return this.props.passed;
  }
  get needsManualGrading() {
    return this.props.needsManualGrading;
  }
  get startedAt() {
    return this.props.startedAt;
  }
  get submittedAt() {
    return this.props.submittedAt;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  isSubmitted(): boolean {
    return this.props.submittedAt !== null;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  // ===== Auto-save trong lúc làm bài (chưa nộp) =====
  tempSave(
    rawAnswers: RawAnswerInput[],
    state?: Record<string, unknown>,
  ): void {
    if (this.isSubmitted()) {
      throw new Error("Cannot modify a submitted attempt");
    }
    // Chỉ lưu tạm, chưa chấm điểm — set trạng thái "chưa xác định"
    this.props.answers = rawAnswers.map((a) => ({
      questionId: a.questionId,
      answer: a.answer,
      isCorrect: null,
      score: 0,
      requiresManualGrading: false,
      graderFeedback: null,
    }));
    if (state !== undefined) this.props.state = { ...state };
    this.touch();
  }

  // ================================================================
  // NỘP BÀI — chấm điểm bằng QuestionEntity.grade(), KHÔNG viết lại
  // logic so khớp ở đây hay ở controller.
  //
  // passingScore: ngưỡng % để đậu, lấy từ cấu hình của Quiz
  // (KHÔNG hard-code 90 như controller cũ).
  // ================================================================
  submit(
    questions: QuestionEntity[],
    rawAnswers: RawAnswerInput[],
    passingScore: number,
    submittedLate = false,
  ): void {
    if (this.isSubmitted()) {
      throw new Error("This attempt has already been submitted");
    }

    let earned = 0;
    let possible = 0;
    let needsManual = false;

    const graded: QuizAnswer[] = rawAnswers.map((a) => {
      const question = questions.find((q) => q.id === a.questionId);

      if (!question) {
        // Câu hỏi không tồn tại trong quiz (dữ liệu bất thường) -> tính 0 điểm,
        // không throw để không làm hỏng toàn bộ lượt nộp.
        return {
          questionId: a.questionId,
          answer: a.answer,
          isCorrect: false,
          score: 0,
          requiresManualGrading: false,
          graderFeedback: null,
        };
      }

      const result = question.grade(a.answer);

      if (result.requiresManualGrading) {
        needsManual = true;
      } else {
        earned += result.score;
        possible += result.maxScore;
      }

      return {
        questionId: a.questionId,
        answer: a.answer,
        isCorrect: result.isCorrect,
        score: result.score,
        requiresManualGrading: result.requiresManualGrading,
        graderFeedback: null,
      };
    });

    const finalScore =
      possible === 0 ? 0 : Math.round((earned / possible) * 100);

    this.props.answers = graded;
    this.props.score = finalScore;
    this.props.passed = finalScore >= passingScore;
    this.props.needsManualGrading = needsManual;
    this.props.submittedLate = submittedLate;
    this.props.submittedAt = new Date();
    this.touch();
  }

  // Dùng khi giáo viên chấm tay xong câu essay/speaking, cập nhật lại điểm cuối.
  // @param questions - toàn bộ câu hỏi trong quiz (cùng thứ tự lúc submit), dùng để tính lại tổng điểm.
  applyManualGrade(
    questionId: number,
    score: number,
    maxScore: number,
    passingScore: number,
    questions: QuestionEntity[],
    feedback?: string,
  ): void {
    if (!this.isSubmitted()) {
      throw new Error("Cannot grade an attempt before it is submitted");
    }
    const answer = this.props.answers.find((a) => a.questionId === questionId);
    if (!answer) throw new Error(`Answer for question ${questionId} not found`);
    if (!answer.requiresManualGrading) {
      throw new Error("This question does not require manual grading");
    }

    if (
      !Number.isFinite(score) ||
      !Number.isFinite(maxScore) ||
      maxScore < 0 ||
      score < 0 ||
      score > maxScore
    ) {
      throw new Error("Manual grade must be between zero and the maximum score");
    }
    answer.score = score;
    answer.isCorrect = answer.score >= maxScore;
    if (feedback !== undefined) answer.graderFeedback = feedback.trim() || null;

    let earned = 0;
    let possible = 0;
    for (const q of questions) {
      const a = this.props.answers.find((x) => x.questionId === q.id);
      if (!a) continue;
      if (a.requiresManualGrading) {
        possible += q.points;
        if (a.isCorrect !== null) earned += a.score;
        continue;
      }
      const res = q.grade(a.answer);
      if (!res.requiresManualGrading) {
        earned += res.score;
        possible += res.maxScore;
      }
    }

    const finalScore =
      possible === 0 ? 0 : Math.round((earned / possible) * 100);
    this.props.score = finalScore;
    this.props.passed = finalScore >= passingScore;

    // Cập nhật needsManualGrading: vẫn còn câu nào chấm tay chưa xong không?
    const stillPending = this.props.answers.some(
      (a) => a.requiresManualGrading && a.isCorrect === null,
    );
    this.props.needsManualGrading = stillPending;
    this.touch();
  }

  toJSON(): UserQuizResultProps {
    return { ...this.props, submittedLate: this.submittedLate };
  }
}
