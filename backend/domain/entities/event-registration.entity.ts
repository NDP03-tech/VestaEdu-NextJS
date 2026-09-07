// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
import { normalizeEmail, requireNonEmpty } from "../../utils/validation";

interface EventRegistrationProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  eventId: number;
  eventTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateEventRegistrationProps {
  name: string;
  email: string;
  phone: string;
  eventId: number;
  eventTitle: string;
}

export class EventRegistrationEntity {
  private constructor(
    private readonly _id: number,
    private _name: string,
    private _email: string,
    private _phone: string,
    private _eventId: number,
    private _eventTitle: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(props: CreateEventRegistrationProps): EventRegistrationEntity {
    const now = new Date();
    return new EventRegistrationEntity(0,
      requireNonEmpty(props.name, "name"),
      normalizeEmail(props.email),
      requireNonEmpty(props.phone, "phone"),
      Number(props.eventId),
      requireNonEmpty(props.eventTitle, "eventTitle"),
      now,
      now
    );
  }

  static reconstitute(props: EventRegistrationProps): EventRegistrationEntity {
    return new EventRegistrationEntity(
      props.id,
      props.name,
      props.email,
      props.phone,
      props.eventId,
      props.eventTitle,
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
  get eventId(): number {
    return this._eventId;
  }
  get eventTitle(): string {
    return this._eventTitle;
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
