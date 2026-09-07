// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
interface RefreshTokenProps {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateRefreshTokenProps {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}

export class RefreshTokenEntity {
  private constructor(
    private readonly _id: number,
    private _userId: number,
    private _tokenHash: string,
    private _expiresAt: Date,
    private _revokedAt: Date | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(props: CreateRefreshTokenProps): RefreshTokenEntity {
    if (!props.tokenHash || props.tokenHash.length !== 64) {
      throw new Error("tokenHash must be a 64-char SHA-256 hash");
    }
    if (!(props.expiresAt instanceof Date) || isNaN(props.expiresAt.getTime())) {
      throw new Error("expiresAt must be a valid Date");
    }
    const now = new Date();
    return new RefreshTokenEntity(0,
      Number(props.userId),
      props.tokenHash,
      props.expiresAt,
      null,
      now,
      now
    );
  }

  static reconstitute(props: RefreshTokenProps): RefreshTokenEntity {
    return new RefreshTokenEntity(
      props.id,
      props.userId,
      props.tokenHash,
      props.expiresAt,
      props.revokedAt,
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
  get tokenHash(): string {
    return this._tokenHash;
  }
  get expiresAt(): Date {
    return this._expiresAt;
  }
  get revokedAt(): Date | null {
    return this._revokedAt;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ===== Business methods =====
  isRevoked(): boolean {
    return this._revokedAt !== null;
  }

  isExpired(now: Date = new Date()): boolean {
    return this._expiresAt.getTime() <= now.getTime();
  }

  isActive(now: Date = new Date()): boolean {
    return !this.isRevoked() && !this.isExpired(now);
  }

  revoke(): void {
    if (this._revokedAt) return;
    this._revokedAt = new Date();
    this._updatedAt = new Date();
  }
}
