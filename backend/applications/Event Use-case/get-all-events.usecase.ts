import { EventEntity } from "../../domain/entities";
import type { eventRepository } from "../../domain/repositories/event.repository.interface";
export class GetAllEventsUseCase {
  constructor(private readonly eventRepository: eventRepository) {}
  async execute(): Promise<EventEntity[]> {
    return (await this.eventRepository.getAll()) ?? [];
  }
}
export { GetAllEventsUseCase as ListEventsUseCase };
