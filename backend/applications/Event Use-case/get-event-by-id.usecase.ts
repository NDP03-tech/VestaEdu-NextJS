import { EventEntity } from "../../domain/entities";
import type { eventRepository } from "../../domain/repositories/event.repository.interface";
import { EventNotFoundException } from "./event.exceptions";
import { normalizeEventId } from "./event.helpers";
export class GetEventByIdUseCase {
  constructor(private readonly eventRepository: eventRepository) {}
  async execute(id: string | number): Promise<EventEntity> {
    const key = normalizeEventId(id);
    const entity = await this.eventRepository.getById(key);
    if (!entity) throw new EventNotFoundException(key);
    return entity;
  }
}
export { GetEventByIdUseCase as GetEventUseCase };
