import type { eventRegistrationRepository } from "../../domain/repositories/event-registration.repository.interface";
import { normalizeEntityId, type EntityId } from "../use-case.helpers";

export class DeleteEventRegistrationUseCase {
  constructor(private readonly repository: eventRegistrationRepository) {}

  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(
      normalizeEntityId(id, "EventRegistration"),
    );
  }
}
