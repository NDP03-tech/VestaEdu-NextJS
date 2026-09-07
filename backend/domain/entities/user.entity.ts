// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
import {
  normalizeEmail,
  normalizeEmailOptional,
  validatePassword,
} from "../../utils/validation";
import type { PasswordHasher } from "../ports/password-hasher.port";

export type UserRole = "admin" | "teacher" | "student";

interface UserProps {
  id: number;
  email: string;
  /** BCRYPT hash (60 ký tự, bắt đầu bằng $2a$/$2b$). KHÔNG bao giờ là plain text. */
  passwordHash: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  studentPhone?: string | null;
  guardianPhone?: string | null;
  studentEmail?: string | null;
  guardianEmail?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserProps {
  email: string;
  /** Plain text password. Sẽ được hash bằng `hasher.hash()` bên trong factory. */
  password: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  studentPhone?: string;
  guardianPhone?: string;
  studentEmail?: string;
  guardianEmail?: string;
  address?: string;
}

export class UserEntity {
  private constructor(
    private readonly _id: number,
    private _email: string,
    private _passwordHash: string,
    private _role: UserRole,
    private _firstName: string | null,
    private _lastName: string | null,
    private _studentPhone: string | null,
    private _guardianPhone: string | null,
    private _studentEmail: string | null,
    private _guardianEmail: string | null,
    private _address: string | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  /**
   * Factory tạo User mới. Tự hash password bằng `hasher`.
   * @param props     Thông tin user (password là plain text)
   * @param hasher    Adapter hash (xem infrastructure/security)
   * @throws          nếu email / password không hợp lệ
   */
  static async create(
    props: CreateUserProps,
    hasher: PasswordHasher
  ): Promise<UserEntity> {
    const now = new Date();
    const validatedPassword = validatePassword(props.password);
    const passwordHash = await hasher.hash(validatedPassword);
    return new UserEntity(0,
      normalizeEmail(props.email),
      passwordHash,
      props.role ?? "student",
      props.firstName?.trim() || null,
      props.lastName?.trim() || null,
      props.studentPhone?.trim() || null,
      props.guardianPhone?.trim() || null,
      normalizeEmailOptional(props.studentEmail),
      normalizeEmailOptional(props.guardianEmail),
      props.address?.trim() || null,
      now,
      now
    );
  }

  /**
   * Tái tạo entity từ persistence (DB) - KHÔNG hash lại.
   * Password ở đây PHẢI là hash đã lưu trong DB.
   */
  static reconstitute(props: UserProps): UserEntity {
    return new UserEntity(
      props.id,
      props.email,
      props.passwordHash,
      props.role,
      props.firstName ?? null,
      props.lastName ?? null,
      props.studentPhone ?? null,
      props.guardianPhone ?? null,
      props.studentEmail ?? null,
      props.guardianEmail ?? null,
      props.address ?? null,
      props.createdAt,
      props.updatedAt
    );
  }

  // ===== Getters =====
  get id(): number {
    return this._id;
  }
  get email(): string {
    return this._email;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }
  get role(): UserRole {
    return this._role;
  }
  get firstName(): string | null {
    return this._firstName;
  }
  get lastName(): string | null {
    return this._lastName;
  }
  get fullName(): string {
    return [this._firstName, this._lastName].filter(Boolean).join(" ").trim();
  }
  get studentPhone(): string | null {
    return this._studentPhone;
  }
  get guardianPhone(): string | null {
    return this._guardianPhone;
  }
  get studentEmail(): string | null {
    return this._studentEmail;
  }
  get guardianEmail(): string | null {
    return this._guardianEmail;
  }
  get address(): string | null {
    return this._address;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ===== Business methods =====
  changeEmail(email: string): void {
    this._email = normalizeEmail(email);
    this._updatedAt = new Date();
  }

  /**
   * Đổi mật khẩu. Tự hash plain text bằng `hasher`.
   * @throws nếu plain password quá ngắn
   */
  async changePassword(
    plainPassword: string,
    hasher: PasswordHasher
  ): Promise<void> {
    const validated = validatePassword(plainPassword);
    this._passwordHash = await hasher.hash(validated);
    this._updatedAt = new Date();
  }

  /**
   * Inject hash đã có sẵn (ví dụ: khi admin reset password bằng hash cố định,
   * hoặc khi import từ nguồn khác). KHÔNG dùng cho đổi mật khẩu từ plain text.
   */
  setHashedPassword(hashed: string): void {
    if (!hashed) throw new Error("Password hash cannot be empty");
    if (!hashed.startsWith("$2")) {
      throw new Error(
        "Provided value is not a bcrypt hash (expected format $2a$/$2b$/$2y$)"
      );
    }
    this._passwordHash = hashed;
    this._updatedAt = new Date();
  }

  /**
   * Xác thực mật khẩu người dùng nhập.
   * @returns true nếu khớp, false nếu sai
   */
  async verifyPassword(
    plainPassword: string,
    hasher: PasswordHasher
  ): Promise<boolean> {
    if (!plainPassword) return false;
    return await hasher.verify(plainPassword, this._passwordHash);
  }

  changeRole(role: UserRole): void {
    if (!["admin", "teacher", "student"].includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
    this._role = role;
    this._updatedAt = new Date();
  }

  updateProfile(props: {
    firstName?: string;
    lastName?: string;
    studentPhone?: string;
    guardianPhone?: string;
    studentEmail?: string;
    guardianEmail?: string;
    address?: string;
  }): void {
    if (props.firstName !== undefined)
      this._firstName = props.firstName?.trim() || null;
    if (props.lastName !== undefined)
      this._lastName = props.lastName?.trim() || null;
    if (props.studentPhone !== undefined)
      this._studentPhone = props.studentPhone?.trim() || null;
    if (props.guardianPhone !== undefined)
      this._guardianPhone = props.guardianPhone?.trim() || null;
    if (props.studentEmail !== undefined)
      this._studentEmail = normalizeEmailOptional(props.studentEmail);
    if (props.guardianEmail !== undefined)
      this._guardianEmail = normalizeEmailOptional(props.guardianEmail);
    if (props.address !== undefined)
      this._address = props.address?.trim() || null;
    this._updatedAt = new Date();
  }

  toPublicJSON(): {
    id: number;
    email: string;
    role: UserRole;
    firstName: string | null;
    lastName: string | null;
  } {
    return {
      id: this._id,
      email: this._email,
      role: this._role,
      firstName: this._firstName,
      lastName: this._lastName,
    };
  }
}

