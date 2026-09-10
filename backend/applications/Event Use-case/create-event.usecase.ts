import { EventEntity } from "../../domain/entities";
import type { eventRepository } from "../../domain/repositories/event.repository.interface";
import type { CreateEventInput } from "./event.use-case.interface";
import {
  asInputValidationError,
  EventInputValidationError,
} from "./event.exceptions";
export class CreateEventUseCase {
  constructor(private readonly eventRepository: eventRepository) {}
  async execute(input: CreateEventInput): Promise<void> {
    if (!input || typeof input !== "object")
      throw new EventInputValidationError("Event input must be an object");
    try {
      await this.eventRepository.create(EventEntity.create(input));
    } catch (error) {
      throw asInputValidationError(error);
    }
  }
}
