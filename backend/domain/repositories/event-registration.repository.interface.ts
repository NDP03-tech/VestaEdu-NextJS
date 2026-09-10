import { EventRegistrationEntity } from "../entities";

export interface eventRegistrationRepository {
  delete(id: string): Promise<void>;
  create(registration: EventRegistrationEntity): Promise<void>;
  getById(id: string): Promise<EventRegistrationEntity | null>;
  getAll(): Promise<EventRegistrationEntity[] | null>;
  update(id: string): Promise<void>;
}
