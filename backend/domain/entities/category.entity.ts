import { randomUUID } from "crypto";
import { validateName } from "../../utils/validation";
export class CategoryEntity {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}
  static create(props: { name: string }): CategoryEntity {
    return new CategoryEntity(randomUUID(), validateName(props.name), new Date(), new Date());
  }

  static reconstitute(props: {
    id: string;
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

  updateName(name: string): void {
    this._name = validateName(name);
    this._updatedAt = new Date();
  }
}
