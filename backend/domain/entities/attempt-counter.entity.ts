// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
interface AttemptCounterProps {
  id: number;
  userId: number;
  quizId: number;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateAttemptCounterProps {
  userId: number;
  quizId: number;
  count?: number;
}

export class AttemptCounterEntity {
  private constructor(
    private readonly _id: number,
    private _userId: number,
    private _quizId: number,
    private _count: number,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(props: CreateAttemptCounterProps): AttemptCounterEntity {
    if (props.userId === undefined || props.userId === null) {
      throw new Error("userId is required");
    }
    if (props.quizId === undefined || props.quizId === null) {
      throw new Error("quizId is required");
    }
    const now = new Date();
    return new AttemptCounterEntity(0,
      Number(props.userId),
      Number(props.quizId),
      Math.max(0, Number(props.count ?? 0)),
      now,
      now
    );
  }

  static reconstitute(props: AttemptCounterProps): AttemptCounterEntity {
    return new AttemptCounterEntity(
      props.id,
      props.userId,
      props.quizId,
      props.count,
      props.createdAt,
      props.updatedAt
    );
  }

  // ===== Getters =====
  get id(): number {
    return this._id;
  }
  get userId(): number {
    return this._userId;
  }
  get quizId(): number {
    return this._quizId;
  }
  get count(): number {
    return this._count;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ===== Business methods =====
  increment(): number {
    this._count += 1;
    this._updatedAt = new Date();
    return this._count;
  }

  reset(): void {
    this._count = 0;
    this._updatedAt = new Date();
  }

  setCount(value: number): void {
    this._count = Math.max(0, Number(value) || 0);
    this._updatedAt = new Date();
  }
}
