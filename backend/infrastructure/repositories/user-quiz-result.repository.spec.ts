jest.mock("../persistence/AttemptCounter", () => ({
  AttemptCounter: class AttemptCounter {},
}));
jest.mock("../persistence/Quiz", () => ({ Quiz: class Quiz {} }));
jest.mock("../persistence/UserQuizResult", () => ({
  UserQuizResult: class UserQuizResult {},
}));

import { AttemptCounter } from "../persistence/AttemptCounter";
import { Quiz } from "../persistence/Quiz";
import { UserQuizResult } from "../persistence/UserQuizResult";
import { UserQuizResultEntity } from "../../domain/entities";
import { UserQuizResultRepository } from "./user-quiz-result.repository";

describe("UserQuizResultRepository start transaction", () => {
  it("creates and locks the unique user/quiz counter inside one transaction", async () => {
    const queryBuilder = {
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      orIgnore: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(undefined),
    };
    const counterRow = {
      id: 12,
      user_id: 3,
      quiz_id: 8,
      count: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const quizRow = {
      id: 8,
      title: "Quiz",
      category: "English",
      visibleTo: "everyone",
      passingScore: 90,
      status: "published",
      version: 4,
      uiSettings: { mode: "exam" },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const manager = {
      createQueryBuilder: jest.fn(() => queryBuilder),
      findOne: jest.fn(async (entity: unknown) =>
        entity === AttemptCounter ? counterRow : quizRow,
      ),
      count: jest.fn(),
      save: jest.fn(),
    };
    const dataSource = {
      transaction: jest.fn(
        async <T>(operation: (value: typeof manager) => Promise<T>) =>
          operation(manager),
      ),
    };
    const repository = new UserQuizResultRepository(
      {} as never,
      dataSource as never,
    );

    const count = await repository.withUserQuizStartLock(3, 8, async (tx) => {
      const quiz = await tx.getQuiz();
      expect(quiz?.status).toBe("published");
      return tx.counter.count;
    });

    expect(count).toBe(2);
    expect(dataSource.transaction).toHaveBeenCalledTimes(1);
    expect(queryBuilder.values).toHaveBeenCalledWith({
      user_id: 3,
      quiz_id: 8,
      count: 0,
    });
    expect(queryBuilder.orIgnore).toHaveBeenCalledTimes(1);
    expect(manager.findOne).toHaveBeenNthCalledWith(
      1,
      AttemptCounter,
      expect.objectContaining({
        where: { user_id: 3, quiz_id: 8 },
        lock: { mode: "pessimistic_write" },
      }),
    );
    expect(manager.findOne).toHaveBeenNthCalledWith(
      2,
      Quiz,
      expect.objectContaining({
        where: { id: 8 },
        lock: { mode: "pessimistic_read" },
      }),
    );
  });

  it("returns the database-generated ID for a newly started attempt", async () => {
    const queryBuilder = {
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      orIgnore: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(undefined),
    };
    const counterRow = {
      id: 12,
      user_id: 3,
      quiz_id: 8,
      count: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const manager = {
      createQueryBuilder: jest.fn(() => queryBuilder),
      findOne: jest.fn().mockResolvedValue(counterRow),
      count: jest.fn(),
      save: jest.fn(async (_entity: unknown, row: Record<string, unknown>) => ({
        ...row,
        id: 25,
      })),
    };
    const dataSource = {
      transaction: jest.fn(
        async <T>(operation: (value: typeof manager) => Promise<T>) =>
          operation(manager),
      ),
    };
    const repository = new UserQuizResultRepository(
      {} as never,
      dataSource as never,
    );

    const result = await repository.withUserQuizStartLock(3, 8, (tx) =>
      tx.createAttempt(
        UserQuizResultEntity.create({
          userId: 3,
          quizId: 8,
          attemptNumber: 1,
        }),
      ),
    );

    expect(result.id).toBe(25);
    expect(manager.save).toHaveBeenCalledWith(
      UserQuizResult,
      expect.not.objectContaining({ id: 0 }),
    );
  });
});
