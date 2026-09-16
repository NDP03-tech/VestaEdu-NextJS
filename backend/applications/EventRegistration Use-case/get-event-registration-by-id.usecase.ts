import { EventRegistrationEntity } from "../../domain/entities";
import type { eventRegistrationRepository } from "../../domain/repositories/event-registration.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class GetEventRegistrationByIdUseCase {
  constructor(private readonly repository: eventRegistrationRepository) {}

  async execute(id: EntityId): Promise<EventRegistrationEntity> {
    const key = normalizeEntityId(id, "EventRegistration");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("EventRegistration", id);
    return entity;
  }
}

export {
  GetEventRegistrationByIdUseCase as GetEventRegistrationUseCase,
};
