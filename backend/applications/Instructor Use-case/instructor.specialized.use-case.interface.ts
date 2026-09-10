import type { InstructorEntity } from "../../domain/entities";
export interface InstructorQueryRepository {
  findPage(input: {
    status?: string;
    search?: string;
    offset: number;
    limit: number;
  }): Promise<{ rows: InstructorEntity[]; total: number }>;
  bulkCreate(items: InstructorEntity[]): Promise<void>;
}
