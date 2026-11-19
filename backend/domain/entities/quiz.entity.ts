// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
export type QuizVisibility = "everyone" | string;
export type QuizStatus = "draft" | "published" | "archived";
export const isQuizStatus = (value: unknown): value is QuizStatus =>
  value === "draft" || value === "published" || value === "archived";

export interface QuizUiSettings {
  oneQuestionPerPage: boolean;
  showQuestionNumbers: boolean;
  shuffle: "none" | "questions" | "answers" | "both";
  timeLimit: number;
  maxAttempts: number | "Unlimited";
  showFeedback: boolean;
  displayScore: boolean;
  specialChars: string;
  headerText: string;
  instructionText: string;
  quizCompleteMessage: string;
  showHeaderInput: boolean;
  showCompletionInput: boolean;
  showInstructionInput: boolean;
}

interface QuizProps {
  id: number;
  title: string;
  category: string;
  visibleTo: QuizVisibility;
  uiSettings: QuizUiSettings;
  /**
   * Ngưỡng % điểm để pass (0-100). Mặc định 90.
   * Tách khỏi uiSettings vì là business rule, không phải UI setting.
   * Dùng bởi UserQuizResultEntity.submit() / applyManualGrade() thay vì hard-code.
   */
  passingScore: number;
  status?: QuizStatus;
  version?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateQuizProps {
  title?: string;
  category?: string;
  visibleTo?: QuizVisibility;
  uiSettings?: Partial<QuizUiSettings>;
  passingScore?: number;
  status?: QuizStatus;
}

/** Default passing score theo model Quiz.js thật (90%) */
const DEFAULT_PASSING_SCORE = 90;

const DEFAULT_UI: QuizUiSettings = {
  oneQuestionPerPage: false,
  showQuestionNumbers: true,
  shuffle: "none",
  timeLimit: 0,
  maxAttempts: "Unlimited",
  showFeedback: true,
  displayScore: true,
  specialChars: "",
  headerText: "",
  instructionText: "",
  quizCompleteMessage: "",
  showHeaderInput: false,
  showCompletionInput: false,
  showInstructionInput: false,
};

export class QuizEntity {
  private constructor(
    private readonly _id: number,
    private _title: string | null,
    private _category: string | null,
    private _visibleTo: QuizVisibility,
    private _uiSettings: QuizUiSettings,
    private _passingScore: number,
    private _status: QuizStatus,
    private readonly _version: number,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(props: CreateQuizProps = {}): QuizEntity {
    const now = new Date();
    const passingScore = Math.max(
      0,
      Math.min(100, Number(props.passingScore ?? DEFAULT_PASSING_SCORE))
    );
    return new QuizEntity(0,
      props.title?.trim() || null,
      props.category?.trim() || null,
      props.visibleTo ?? "everyone",
      QuizEntity.mergeUiSettings(props.uiSettings),
      passingScore,
      props.status ?? "published",
      1,
      now,
      now
    );
  }

  static reconstitute(props: QuizProps): QuizEntity {
    return new QuizEntity(
      props.id,
      props.title ?? null,
      props.category ?? null,
      props.visibleTo,
      QuizEntity.mergeUiSettings(props.uiSettings),
      props.passingScore ?? DEFAULT_PASSING_SCORE,
      props.status ?? "published",
      props.version ?? 1,
      props.createdAt,
      props.updatedAt
    );
  }

  // ===== Getters =====
  get id(): number {
    return this._id;
  }
  get title(): string | null {
    return this._title;
  }
  get category(): string | null {
    return this._category;
  }
  get visibleTo(): QuizVisibility {
    return this._visibleTo;
  }
  get uiSettings(): QuizUiSettings {
    return this._uiSettings;
  }
  get passingScore(): number {
    return this._passingScore;
  }
  get status(): QuizStatus {
    return this._status;
  }
  get version(): number {
    return this._version;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      visibleTo: this.visibleTo,
      uiSettings: this.uiSettings,
      passingScore: this.passingScore,
      status: this.status,
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // ===== Business methods =====
  rename(title: string): void {
    this._title = title?.trim() || null;
    this._updatedAt = new Date();
  }

  setCategory(category: string | null): void {
    this._category = category?.trim() || null;
    this._updatedAt = new Date();
  }

  setVisibility(visibleTo: QuizVisibility): void {
    if (!visibleTo || !visibleTo.trim()) {
      throw new Error("visibleTo cannot be empty");
    }
    this._visibleTo = visibleTo.trim();
    this._updatedAt = new Date();
  }

  updateUiSettings(settings: Partial<QuizUiSettings>): void {
    this._uiSettings = QuizEntity.mergeUiSettings({
      ...this._uiSettings,
      ...settings,
    });
    this._updatedAt = new Date();
  }

  /**
   * Cập nhật ngưỡng pass. Kẹp trong [0, 100].
   * @throws nếu không phải số hợp lệ
   */
  setPassingScore(score: number): void {
    const n = Number(score);
    if (!Number.isFinite(n)) {
      throw new Error("passingScore must be a valid number");
    }
    this._passingScore = Math.max(0, Math.min(100, n));
    this._updatedAt = new Date();
  }

  setStatus(status: QuizStatus): void {
    if (!isQuizStatus(status)) {
      throw new Error("status must be draft, published, or archived");
    }
    this._status = status;
    this._updatedAt = new Date();
  }

  // ===== Static helpers =====
  static mergeUiSettings(partial?: Partial<QuizUiSettings>): QuizUiSettings {
    return { ...DEFAULT_UI, ...(partial ?? {}) };
  }

  static get defaultUiSettings(): QuizUiSettings {
    return { ...DEFAULT_UI };
  }
}

