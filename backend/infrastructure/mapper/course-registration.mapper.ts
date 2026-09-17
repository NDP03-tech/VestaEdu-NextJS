import { CourseRegistrationEntity } from "../../domain/entities";
import { CourseRegistration } from "../persistence/CourseRegistration";

export class CourseRegistrationMapper {
  static toDomain(orm: CourseRegistration): CourseRegistrationEntity {
    return CourseRegistrationEntity.reconstitute({
      id: orm.id,
      name: orm.name,
      email: orm.email,
      phone: orm.phone,
      courseId: orm.courseId,
      courseTitle: orm.courseTitle,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(
    registration: CourseRegistrationEntity,
  ): CourseRegistration {
    const orm = new CourseRegistration();
    orm.id = registration.id;
    orm.name = registration.name;
    orm.email = registration.email;
    orm.phone = registration.phone;
    orm.courseId = registration.courseId;
    orm.courseTitle = registration.courseTitle;
    orm.createdAt = registration.createdAt;
    orm.updatedAt = registration.updatedAt;
    return orm;
  }
}
