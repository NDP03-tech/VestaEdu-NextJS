import { EventEntity } from "../entities";

export interface eventRepository {
  delete(id: string): Promise<void>;
  create(event: EventEntity): Promise<void>;
  getById(id: string): Promise<EventEntity | null>;
  getAll(): Promise<EventEntity[] | null>;
  update(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}

