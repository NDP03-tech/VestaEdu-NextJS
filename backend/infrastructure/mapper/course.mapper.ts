import { CourseEntity } from "../../domain/entities";
import { Course } from "../persistence/Course";

export class CourseMapper {
  static toDomain(orm: Course): CourseEntity {
    return CourseEntity.reconstitute({
      id: orm.id,
      image: orm.image,
      bannerImg: orm.bannerImg,
      name: orm.name,
      author: orm.author,
      authorImg: orm.authorImg,
      lesson: orm.lesson,
      price: orm.price,
      duration: orm.duration,
      type: orm.type,
      language: orm.language,
      content: orm.content,
      title: orm.title,
      dis: orm.dis,
      schedule: Array.isArray(orm.schedule) ? orm.schedule : [],
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(course: CourseEntity): Course {
    const orm = new Course();
    orm.id = course.id;
    orm.image = course.image;
    orm.bannerImg = course.bannerImg;
    orm.name = course.name;
    orm.author = course.author;
    orm.authorImg = course.authorImg;
    orm.lesson = course.lesson;
    orm.price = course.price;
    orm.duration = course.duration;
    orm.type = course.type;
    orm.language = course.language;
    orm.content = course.content;
    orm.title = course.title;
    orm.dis = course.dis;
    orm.schedule = course.schedule;
    orm.createdAt = course.createdAt;
    orm.updatedAt = course.updatedAt;
    return orm;
  }
}
