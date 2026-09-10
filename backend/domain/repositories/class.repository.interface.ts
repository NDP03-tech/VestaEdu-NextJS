import { ClassEntity } from "../entities";

export interface classRepository {
  delete(id: string): Promise<void>;
  create(classEntity: ClassEntity): Promise<void>;
  getById(id: string): Promise<ClassEntity | null>;
  getAll(): Promise<ClassEntity[] | null>;
  update(id: string): Promise<void>;
}
