import { EventRegistrationEntity } from "../../domain/entities";
import type { eventRegistrationRepository } from "../../domain/repositories/event-registration.repository.interface";
import type { EventRegistrationQueryRepository } from "./event-registration.specialized.use-case.interface";
export type RegisterEventInput = Parameters<
  typeof EventRegistrationEntity.create
>[0];
export class RegisterEventUseCase {
  constructor(
    private readonly repository: eventRegistrationRepository,
    private readonly queries: EventRegistrationQueryRepository,
  ) {}
  async execute(input: RegisterEventInput): Promise<void> {
    if (
      await this.queries.findByEmailAndEvent(input.email, Number(input.eventId))
    )
      throw new Error("Event already registered");
    await this.repository.create(EventRegistrationEntity.create(input));
  }
}
