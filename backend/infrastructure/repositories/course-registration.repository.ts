import { Repository } from "typeorm";
import { CourseRegistrationEntity } from "../../domain/entities";
import { courseRegistrationRepository } from "../../domain/repositories/course-registration.repository.interface";
import { CourseRegistration } from "../persistence/CourseRegistration";
import { CourseRegistrationMapper } from "../mapper/course-registration.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";
import { CourseRegistrationQueryRepository } from "../../applications/CourseRegistration Use-case/course-registration.specialized.use-case.interface";

export class CourseRegistrationRepository
  extends TypeOrmCrudRepository<CourseRegistrationEntity, CourseRegistration>
  implements courseRegistrationRepository, CourseRegistrationQueryRepository
{
  constructor(repository: Repository<CourseRegistration>) {
    super(repository, CourseRegistrationMapper);
  }

  async findByEmailAndCourse(
    email: string,
    courseId: number,
  ): Promise<CourseRegistrationEntity | null> {
    const row = await this.repository.findOneBy({ email, courseId });
    return row ? CourseRegistrationMapper.toDomain(row) : null;
  }
}
