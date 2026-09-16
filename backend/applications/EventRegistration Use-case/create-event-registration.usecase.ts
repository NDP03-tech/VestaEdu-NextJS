import { EventRegistrationEntity } from "../../domain/entities";
import type { eventRegistrationRepository } from "../../domain/repositories/event-registration.repository.interface";
import type { CreateEventRegistrationInput } from "./event-registration.use-case.interface";

export class CreateEventRegistrationUseCase {
  constructor(private readonly repository: eventRegistrationRepository) {}

  async execute(input: CreateEventRegistrationInput): Promise<void> {
    await this.repository.create(EventRegistrationEntity.create(input));
  }
}
