jest.mock("../persistence/Quiz", () => ({ Quiz: class Quiz {} }));
jest.mock("../persistence/Question", () => ({ Question: class Question {} }));
jest.mock("../persistence/AttemptCounter", () => ({
  AttemptCounter: class AttemptCounter {},
}));
jest.mock("../persistence/UserQuizResult", () => ({
  UserQuizResult: class UserQuizResult {},
}));
import { QuizEntity } from "../../domain/entities";
import { Quiz } from "../persistence/Quiz";
import { QuizRepository } from "./quiz.repository";

describe("QuizRepository lifecycle behavior", () => {
  const createRepository = (manager: Record<string, jest.Mock>) => {
    const dataSource = {
      transaction: (operation: (value: typeof manager) => unknown) =>
        operation(manager),
    };
    return new QuizRepository({} as never, {} as never, dataSource as never);
  };

  it("archives quizzes that have attempt history", async () => {
    const quiz = { id: 7, status: "published", updatedAt: new Date() };
    const manager = {
      findOne: jest.fn().mockResolvedValue(quiz),
      count: jest.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(0),
      save: jest.fn().mockResolvedValue(quiz),
      delete: jest.fn(),
    };

    await createRepository(manager).delete(7);

    expect(quiz.status).toBe("archived");
    expect(manager.save).toHaveBeenCalledWith(Quiz, quiz);
    expect(manager.delete).not.toHaveBeenCalled();
  });

  it("hard-deletes only when no attempt history or counter exists", async () => {
    const manager = {
      findOne: jest.fn().mockResolvedValue({ id: 7, status: "published" }),
      count: jest.fn().mockResolvedValue(0),
      save: jest.fn(),
      delete: jest.fn(),
    };

    await createRepository(manager).delete(7);

    expect(manager.delete).toHaveBeenCalledWith(Quiz, { id: 7 });
    expect(manager.save).not.toHaveBeenCalled();
  });

  it("rejects stale updates before writing", async () => {
    const manager = {
      findOne: jest.fn().mockResolvedValue({ id: 7, version: 3 }),
      save: jest.fn(),
    };
    const repository = createRepository(manager);
    const quiz = QuizEntity.create({ title: "Quiz" });

    await expect(
      repository.updateIfVersionMatches(7, quiz, 2),
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(manager.save).not.toHaveBeenCalled();
  });
});
