// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
import {
  validateName,
  requireNonEmpty,
  validateUrlOrNull,
  normalizeEmailOptional,
} from "../../utils/validation";

export type InstructorStatus = "active" | "inactive";

interface InstructorProps {
  id: number;
  name: string;
  designation: string;
  bio: string | null;
  image: string;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  email: string | null;
  phone: string | null;
  status: InstructorStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateInstructorProps {
  name: string;
  designation: string;
  bio?: string | null;
  image?: string;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: InstructorStatus;
}

export class InstructorEntity {
  private constructor(
    private readonly _id: number,
    private _name: string,
    private _designation: string,
    private _bio: string | null,
    private _image: string,
    private _facebook: string | null,
    private _twitter: string | null,
    private _linkedin: string | null,
    private _email: string | null,
    private _phone: string | null,
    private _status: InstructorStatus,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(props: CreateInstructorProps): InstructorEntity {
    const now = new Date();
    return new InstructorEntity(0,
      validateName(props.name),
      requireNonEmpty(props.designation, "designation"),
      props.bio?.trim() || null,
      props.image?.trim() || "default-instructor.jpg",
      validateUrlOrNull(props.facebook, "Facebook"),
      validateUrlOrNull(props.twitter, "Twitter"),
      validateUrlOrNull(props.linkedin, "Linkedin"),
      normalizeEmailOptional(props.email),
      props.phone?.trim() || null,
      props.status ?? "active",
      now,
      now
    );
  }

  static reconstitute(props: InstructorProps): InstructorEntity {
    return new InstructorEntity(
      props.id,
      props.name,
      props.designation,
      props.bio,
      props.image,
      props.facebook,
      props.twitter,
      props.linkedin,
      props.email,
      props.phone,
      props.status,
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
  get designation(): string {
    return this._designation;
  }
  get bio(): string | null {
    return this._bio;
  }
  get image(): string {
    return this._image;
  }
  get facebook(): string | null {
    return this._facebook;
  }
  get twitter(): string | null {
    return this._twitter;
  }
  get linkedin(): string | null {
    return this._linkedin;
  }
  get email(): string | null {
    return this._email;
  }
  get phone(): string | null {
    return this._phone;
  }
  get status(): InstructorStatus {
    return this._status;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ===== Business methods =====
  rename(name: string): void {
    this._name = validateName(name);
    this._updatedAt = new Date();
  }

  updateDesignation(designation: string): void {
    this._designation = requireNonEmpty(designation, "designation");
    this._updatedAt = new Date();
  }

  setBio(bio: string | null): void {
    this._bio = bio?.trim() || null;
    this._updatedAt = new Date();
  }

  setImage(image: string): void {
    this._image = image?.trim() || "default-instructor.jpg";
    this._updatedAt = new Date();
  }

  setSocial(props: {
    facebook?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
  }): void {
    if (props.facebook !== undefined)
      this._facebook = validateUrlOrNull(props.facebook, "Facebook");
    if (props.twitter !== undefined)
      this._twitter = validateUrlOrNull(props.twitter, "Twitter");
    if (props.linkedin !== undefined)
      this._linkedin = validateUrlOrNull(props.linkedin, "Linkedin");
    this._updatedAt = new Date();
  }

  setContact(props: { email?: string | null; phone?: string | null }): void {
    if (props.email !== undefined)
      this._email = normalizeEmailOptional(props.email);
    if (props.phone !== undefined)
      this._phone = props.phone?.trim() || null;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._status = "active";
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._status = "inactive";
    this._updatedAt = new Date();
  }
}

