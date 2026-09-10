import type { eventRepository } from "../../domain/repositories/event.repository.interface";
import { normalizeEventId } from "./event.helpers";
export class DeleteEventUseCase {
  constructor(private readonly eventRepository: eventRepository) {}
  async execute(id: string | number): Promise<void> {
    await this.eventRepository.delete(normalizeEventId(id));
  }
}
