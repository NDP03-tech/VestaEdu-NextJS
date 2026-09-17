import { ClassEntity } from "../entities";

export interface classRepository {
  delete(id: string | number): Promise<void>;
  create(classEntity: ClassEntity): Promise<void>;
  getById(id: string | number): Promise<ClassEntity | null>;
  getAll(): Promise<ClassEntity[] | null>;
  update(id: string | number, classEntity: ClassEntity): Promise<void>;
}
