import { Repository } from "typeorm";
import { InstructorEntity } from "../../domain/entities";
import { instructorRepository } from "../../domain/repositories/instructor.repository.interface";
import { Instructor } from "../persistence/Instructor";
import { InstructorMapper } from "../mapper/instructor.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";
import { InstructorQueryRepository } from "../../applications/Instructor Use-case/instructor.specialized.use-case.interface";

export class InstructorRepository
  extends TypeOrmCrudRepository<InstructorEntity, Instructor>
  implements instructorRepository, InstructorQueryRepository
{
  constructor(repository: Repository<Instructor>) {
    super(repository, InstructorMapper);
  }

  async findPage(input: {
    status?: string;
    search?: string;
    offset: number;
    limit: number;
  }): Promise<{ rows: InstructorEntity[]; total: number }> {
    const query = this.repository.createQueryBuilder("instructor");
    if (input.status)
      query.andWhere("instructor.status = :status", { status: input.status });
    if (input.search) {
      query.andWhere(
        "(instructor.name ILIKE :search OR instructor.designation ILIKE :search)",
        { search: `%${input.search}%` },
      );
    }
    const [rows, total] = await query
      .skip(input.offset)
      .take(input.limit)
      .orderBy("instructor.createdAt", "DESC")
      .getManyAndCount();
    return {
      rows: rows.map((row) => InstructorMapper.toDomain(row)),
      total,
    };
  }

  async bulkCreate(items: InstructorEntity[]): Promise<void> {
    await this.repository.save(
      items.map((item) => InstructorMapper.toPersistence(item)),
    );
  }
}
