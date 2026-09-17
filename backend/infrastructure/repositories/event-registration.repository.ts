import { Repository } from "typeorm";
import { EventRegistrationEntity } from "../../domain/entities";
import { eventRegistrationRepository } from "../../domain/repositories/event-registration.repository.interface";
import { EventRegistration } from "../persistence/EventRegistration";
import { EventRegistrationMapper } from "../mapper/event-registration.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";
import { EventRegistrationQueryRepository } from "../../applications/EventRegistration Use-case/event-registration.specialized.use-case.interface";

export class EventRegistrationRepository
  extends TypeOrmCrudRepository<EventRegistrationEntity, EventRegistration>
  implements eventRegistrationRepository, EventRegistrationQueryRepository
{
  constructor(repository: Repository<EventRegistration>) {
    super(repository, EventRegistrationMapper);
  }

  async findByEmailAndEvent(
    email: string,
    eventId: number,
  ): Promise<EventRegistrationEntity | null> {
    const row = await this.repository.findOneBy({ email, eventId });
    return row ? EventRegistrationMapper.toDomain(row) : null;
  }
}
