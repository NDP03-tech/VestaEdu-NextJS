import { InstructorEntity } from "../entities";

export interface instructorRepository {
  delete(id: string): Promise<void>;
  create(instructor: InstructorEntity): Promise<void>;
  getById(id: string): Promise<InstructorEntity | null>;
  getAll(): Promise<InstructorEntity[] | null>;
  update(id: string): Promise<void>;
}
