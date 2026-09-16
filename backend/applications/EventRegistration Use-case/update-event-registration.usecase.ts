import { EventRegistrationEntity } from "../../domain/entities";
import type { eventRegistrationRepository } from "../../domain/repositories/event-registration.repository.interface";
import type { UpdateEventRegistration } from "./event-registration.use-case.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class UpdateEventRegistrationUseCase {
  constructor(private readonly repository: eventRegistrationRepository) {}

  async execute(
    id: EntityId,
    update: UpdateEventRegistration,
  ): Promise<void> {
    const key = normalizeEntityId(id, "EventRegistration");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("EventRegistration", id);
    update(entity);
    await this.repository.update(key);
  }
}
