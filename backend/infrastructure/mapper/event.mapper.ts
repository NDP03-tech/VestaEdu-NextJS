import { EventEntity } from "../../domain/entities";
import { Event } from "../persistence/Event";

export class EventMapper {
  static toDomain(orm: Event): EventEntity {
    return EventEntity.reconstitute({
      id: orm.id,
      image: orm.image,
      bannerImg: orm.bannerImg,
      date: orm.date,
      startTime: orm.startTime,
      category: orm.category,
      title: orm.title,
      location: orm.location,
      cost: orm.cost,
      host: orm.host,
      content: orm.content,
      phone: orm.phone,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(event: EventEntity): Event {
    const orm = new Event();
    orm.id = event.id;
    orm.image = event.image;
    orm.bannerImg = event.bannerImg;
    orm.date = event.date;
    orm.startTime = event.startTime;
    orm.category = event.category;
    orm.title = event.title;
    orm.location = event.location;
    orm.cost = event.cost;
    orm.host = event.host;
    orm.content = event.content;
    orm.phone = event.phone;
    orm.createdAt = event.createdAt;
    orm.updatedAt = event.updatedAt;
    return orm;
  }
}
