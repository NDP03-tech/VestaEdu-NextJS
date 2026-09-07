// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
import { normalizeEmail, requireNonEmpty } from "../../utils/validation";

interface CourseRegistrationProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  courseId: number;
  courseTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateCourseRegistrationProps {
  name: string;
  email: string;
  phone: string;
  courseId: number;
  courseTitle: string;
}

export class CourseRegistrationEntity {
  private constructor(
    private readonly _id: number,
    private _name: string,
    private _email: string,
    private _phone: string,
    private _courseId: number,
    private _courseTitle: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(props: CreateCourseRegistrationProps): CourseRegistrationEntity {
    const now = new Date();
    return new CourseRegistrationEntity(0,
      requireNonEmpty(props.name, "name"),
      normalizeEmail(props.email),
      requireNonEmpty(props.phone, "phone"),
      Number(props.courseId),
      requireNonEmpty(props.courseTitle, "courseTitle"),
      now,
      now
    );
  }

  static reconstitute(props: CourseRegistrationProps): CourseRegistrationEntity {
    return new CourseRegistrationEntity(
      props.id,
      props.name,
      props.email,
      props.phone,
      props.courseId,
      props.courseTitle,
      props.createdAt,
      props.updatedAt
    );
  }

  // ===== Getters =====
  get id(): number {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get email(): string {
    return this._email;
  }
  get phone(): string {
    return this._phone;
  }
  get courseId(): number {
    return this._courseId;
  }
  get courseTitle(): string {
    return this._courseTitle;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ===== Business methods =====
  updateContact(props: { name?: string; email?: string; phone?: string }): void {
    if (props.name !== undefined)
      this._name = requireNonEmpty(props.name, "name");
    if (props.email !== undefined)
      this._email = normalizeEmail(props.email);
    if (props.phone !== undefined)
      this._phone = requireNonEmpty(props.phone, "phone");
    this._updatedAt = new Date();
  }
}
