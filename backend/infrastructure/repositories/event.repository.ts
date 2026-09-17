import { Repository } from "typeorm";
import { EventEntity } from "../../domain/entities";
import { eventRepository } from "../../domain/repositories/event.repository.interface";
import { Event } from "../persistence/Event";
import { EventMapper } from "../mapper/event.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";

export class EventRepository
  extends TypeOrmCrudRepository<EventEntity, Event>
  implements eventRepository
{
  constructor(repository: Repository<Event>) {
    super(repository, EventMapper);
  }
}
