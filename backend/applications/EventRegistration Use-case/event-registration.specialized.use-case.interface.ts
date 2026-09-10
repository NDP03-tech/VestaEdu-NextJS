import type { EventRegistrationEntity } from "../../domain/entities";
export interface EventRegistrationQueryRepository {
  findByEmailAndEvent(
    email: string,
    eventId: number,
  ): Promise<EventRegistrationEntity | null>;
}
