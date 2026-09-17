import { EventRegistrationEntity } from "../entities";

export interface eventRegistrationRepository {
  delete(id: string | number): Promise<void>;
  create(registration: EventRegistrationEntity): Promise<void>;
  getById(id: string | number): Promise<EventRegistrationEntity | null>;
  getAll(): Promise<EventRegistrationEntity[] | null>;
  update(
    id: string | number,
    registration: EventRegistrationEntity,
  ): Promise<void>;
}
