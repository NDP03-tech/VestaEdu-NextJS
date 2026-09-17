import { ClassEntity } from "../../domain/entities";
import { Class } from "../persistence/Class";

export class ClassMapper {
  static toDomain(orm: Class): ClassEntity {
    return ClassEntity.reconstitute({
      id: orm.id,
      name: orm.name,
      description: orm.description ?? "",
      teacherId: orm.teacher_id,
      studentIds: (orm.classStudents ?? [])
        .filter((student) => student.isActive)
        .map((student) => student.user_id),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(classEntity: ClassEntity): Class {
    const orm = new Class();
    orm.id = classEntity.id;
    orm.name = classEntity.name;
    orm.description = classEntity.description;
    orm.teacher_id = classEntity.teacherId;
    orm.createdAt = classEntity.createdAt;
    orm.updatedAt = classEntity.updatedAt;
    return orm;
  }
}
