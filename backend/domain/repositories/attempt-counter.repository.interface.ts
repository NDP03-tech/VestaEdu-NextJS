import { AttemptCounterEntity } from "../entities";

export interface attemptCounterRepository {
  delete(id: string): Promise<void>;
  create(counter: AttemptCounterEntity): Promise<void>;
  getById(id: string): Promise<AttemptCounterEntity | null>;
  getAll(): Promise<AttemptCounterEntity[] | null>;
  update(id: string): Promise<void>;
}
