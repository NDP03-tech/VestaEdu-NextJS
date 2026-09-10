// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
import { validateName } from "../../utils/validation";
export class CategoryEntity {
  private constructor(
    private readonly _id: number,
    private _name: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}
  static create(props: { name: string }): CategoryEntity {
    return new CategoryEntity(0, validateName(props.name), new Date(), new Date());
  }

  static reconstitute(props: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }): CategoryEntity {
    return new CategoryEntity(
      props.id,
      props.name,
      props.createdAt,
      props.updatedAt
    );
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: string): void {
    this._name = validateName(name);
    this._updatedAt = new Date();
  }
}
