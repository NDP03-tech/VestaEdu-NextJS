import { EventRegistrationEntity } from "../../domain/entities";
import type { eventRegistrationRepository } from "../../domain/repositories/event-registration.repository.interface";

export class GetAllEventRegistrationsUseCase {
  constructor(private readonly repository: eventRegistrationRepository) {}

  async execute(): Promise<EventRegistrationEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}

export {
  GetAllEventRegistrationsUseCase as ListEventRegistrationsUseCase,
};
