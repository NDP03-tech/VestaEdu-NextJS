import { AttemptCounterEntity } from "../../domain/entities";
import { AttemptCounter } from "../persistence/AttemptCounter";

export class AttemptCounterMapper {
  static toDomain(orm: AttemptCounter): AttemptCounterEntity {
    return AttemptCounterEntity.reconstitute({
      id: orm.id,
      userId: orm.user_id,
      quizId: orm.quiz_id,
      count: orm.count,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(counter: AttemptCounterEntity): AttemptCounter {
    const orm = new AttemptCounter();
    orm.id = counter.id;
    orm.user_id = counter.userId;
    orm.quiz_id = counter.quizId;
    orm.count = counter.count;
    orm.createdAt = counter.createdAt;
    orm.updatedAt = counter.updatedAt;
    return orm;
  }
}
