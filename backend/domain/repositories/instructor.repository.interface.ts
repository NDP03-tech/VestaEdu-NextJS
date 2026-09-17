import { InstructorEntity } from "../entities";

export interface instructorRepository {
  delete(id: string | number): Promise<void>;
  create(instructor: InstructorEntity): Promise<void>;
  getById(id: string | number): Promise<InstructorEntity | null>;
  getAll(): Promise<InstructorEntity[] | null>;
  update(id: string | number, instructor: InstructorEntity): Promise<void>;
}
