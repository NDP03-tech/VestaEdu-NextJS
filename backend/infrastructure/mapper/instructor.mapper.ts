import { InstructorEntity } from "../../domain/entities";

const Instructor = require("../persistence/Instructor");

type InstructorModel = any;

export class InstructorMapper {
  static toDomain(orm: InstructorModel): InstructorEntity {
    return InstructorEntity.reconstitute({
      id: orm.id,
      name: orm.name,
      designation: orm.designation,
      bio: orm.bio ?? null,
      image: orm.image,
      facebook: orm.facebook ?? null,
      twitter: orm.twitter ?? null,
      linkedin: orm.linkedin ?? null,
      email: orm.email ?? null,
      phone: orm.phone ?? null,
      status: orm.status,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(instructor: InstructorEntity): InstructorModel {
    const orm = new Instructor();
    orm.id = instructor.id;
    orm.name = instructor.name;
    orm.designation = instructor.designation;
    orm.bio = instructor.bio;
    orm.image = instructor.image;
    orm.facebook = instructor.facebook;
    orm.twitter = instructor.twitter;
    orm.linkedin = instructor.linkedin;
    orm.email = instructor.email;
    orm.phone = instructor.phone;
    orm.status = instructor.status;
    orm.createdAt = instructor.createdAt;
    orm.updatedAt = instructor.updatedAt;
    return orm;
  }
}
