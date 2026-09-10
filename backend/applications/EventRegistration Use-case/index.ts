import { EventRegistrationEntity } from "../../domain/entities";
import type { eventRegistrationRepository } from "../../domain/repositories/event-registration.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";
export type CreateEventRegistrationInput = Parameters<
  typeof EventRegistrationEntity.create
>[0];
export type UpdateEventRegistration = (entity: EventRegistrationEntity) => void;
export class CreateEventRegistrationUseCase {
  constructor(private readonly repository: eventRegistrationRepository) {}
  async execute(input: CreateEventRegistrationInput): Promise<void> {
    await this.repository.create(EventRegistrationEntity.create(input));
  }
}
export class GetEventRegistrationByIdUseCase {
  constructor(private readonly repository: eventRegistrationRepository) {}
  async execute(id: EntityId): Promise<EventRegistrationEntity> {
    const key = normalizeEntityId(id, "EventRegistration");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("EventRegistration", id);
    return entity;
  }
}
export { GetEventRegistrationByIdUseCase as GetEventRegistrationUseCase };
export class GetAllEventRegistrationsUseCase {
  constructor(private readonly repository: eventRegistrationRepository) {}
  async execute(): Promise<EventRegistrationEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}
export { GetAllEventRegistrationsUseCase as ListEventRegistrationsUseCase };
export class UpdateEventRegistrationUseCase {
  constructor(private readonly repository: eventRegistrationRepository) {}
  async execute(id: EntityId, update: UpdateEventRegistration): Promise<void> {
    const key = normalizeEntityId(id, "EventRegistration");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("EventRegistration", id);
    update(entity);
    await this.repository.update(key);
  }
}
export class DeleteEventRegistrationUseCase {
  constructor(private readonly repository: eventRegistrationRepository) {}
  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "EventRegistration"));
  }
}
export * from "./event-registration.specialized.use-case.interface";
export { RegisterEventUseCase } from "./register-event.usecase";
