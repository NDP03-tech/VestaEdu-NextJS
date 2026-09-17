import { EventRegistrationEntity } from "../../domain/entities";
import { EventRegistration } from "../persistence/EventRegistration";

export class EventRegistrationMapper {
  static toDomain(orm: EventRegistration): EventRegistrationEntity {
    return EventRegistrationEntity.reconstitute({
      id: orm.id,
      name: orm.name,
      email: orm.email,
      phone: orm.phone,
      eventId: orm.eventId,
      eventTitle: orm.eventTitle,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(
    registration: EventRegistrationEntity,
  ): EventRegistration {
    const orm = new EventRegistration();
    orm.id = registration.id;
    orm.name = registration.name;
    orm.email = registration.email;
    orm.phone = registration.phone;
    orm.eventId = registration.eventId;
    orm.eventTitle = registration.eventTitle;
    orm.createdAt = registration.createdAt;
    orm.updatedAt = registration.updatedAt;
    return orm;
  }
}
