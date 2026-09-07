// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
import { validateName } from "../../utils/validation";

export class ClassEntity {
  private constructor(
    private readonly _id: number,
    private _name: string,
    private _description: string,
    private _teacherId: number | null,
    private _studentIds: number[],
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(props: {
    name: string;
    description?: string;
    teacherId?: number | null;
    studentIds?: number[];
  }): ClassEntity {
    const now = new Date();
    return new ClassEntity(0,
      validateName(props.name),
      props.description ?? "",
      props.teacherId ?? null,
      Array.isArray(props.studentIds)
        ? Array.from(new Set(props.studentIds.map((id) => Number(id))))
        : [],
      now,
      now
    );
  }

  static reconstitute(props: {
    id: number;
    name: string;
    description: string;
    teacherId: number | null;
    studentIds: number[];
    createdAt: Date;
    updatedAt: Date;
  }): ClassEntity {
    return new ClassEntity(
      props.id,
      props.name,
      props.description,
      props.teacherId,
      props.studentIds,
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
  get description(): string {
    return this._description;
  }
  get teacherId(): number | null {
    return this._teacherId;
  }
  get studentIds(): number[] {
    return [...this._studentIds];
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

  updateDescription(description: string): void {
    this._description = description?.trim() ?? "";
    this._updatedAt = new Date();
  }

  assignTeacher(teacherId: number | null): void {
    this._teacherId = teacherId ? Number(teacherId) : null;
    this._updatedAt = new Date();
  }

  addStudent(studentId: number): void {
    const id = Number(studentId);
    if (!this._studentIds.includes(id)) {
      this._studentIds.push(id);
      this._updatedAt = new Date();
    }
  }

  addStudents(studentIds: number[]): void {
    let changed = false;
    for (const sid of studentIds) {
      const id = Number(sid);
      if (!this._studentIds.includes(id)) {
        this._studentIds.push(id);
        changed = true;
      }
    }
    if (changed) this._updatedAt = new Date();
  }

  removeStudent(studentId: number): void {
    const id = Number(studentId);
    const idx = this._studentIds.indexOf(id);
    if (idx !== -1) {
      this._studentIds.splice(idx, 1);
      this._updatedAt = new Date();
    }
  }

  removeStudents(studentIds: number[]): void {
    let changed = false;
    for (const sid of studentIds) {
      const id = Number(sid);
      const idx = this._studentIds.indexOf(id);
      if (idx !== -1) {
        this._studentIds.splice(idx, 1);
        changed = true;
      }
    }
    if (changed) this._updatedAt = new Date();
  }
}