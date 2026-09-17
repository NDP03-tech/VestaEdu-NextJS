import { EventEntity } from "../entities";

export interface eventRepository {
  delete(id: string | number): Promise<void>;
  create(event: EventEntity): Promise<void>;
  getById(id: string | number): Promise<EventEntity | null>;
  getAll(): Promise<EventEntity[] | null>;
  update(id: string | number, event: EventEntity): Promise<void>;
}
