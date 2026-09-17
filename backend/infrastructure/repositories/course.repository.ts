import { Repository } from "typeorm";
import { CourseEntity } from "../../domain/entities";
import { courseRepository } from "../../domain/repositories/course.repository.interface";
import { Course } from "../persistence/Course";
import { CourseMapper } from "../mapper/course.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";

export class CourseRepository
  extends TypeOrmCrudRepository<CourseEntity, Course>
  implements courseRepository
{
  constructor(repository: Repository<Course>) {
    super(repository, CourseMapper);
  }
}
