import type { EventRegistrationEntity } from "../../domain/entities";

export type CreateEventRegistrationInput = Parameters<
  typeof EventRegistrationEntity.create
>[0];

export type UpdateEventRegistration = (entity: EventRegistrationEntity) => void;
