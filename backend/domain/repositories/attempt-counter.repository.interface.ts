import { AttemptCounterEntity } from "../entities";

export interface attemptCounterRepository {
  delete(id: string | number): Promise<void>;
  create(counter: AttemptCounterEntity): Promise<void>;
  getById(id: string | number): Promise<AttemptCounterEntity | null>;
  getAll(): Promise<AttemptCounterEntity[] | null>;
  update(id: string | number, counter: AttemptCounterEntity): Promise<void>;
}
