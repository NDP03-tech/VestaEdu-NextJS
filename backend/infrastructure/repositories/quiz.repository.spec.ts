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

  it("increments and returns the version after a successful update", async () => {
    const manager = {
      findOne: jest.fn().mockResolvedValue({ id: 7, version: 3 }),
      save: jest.fn(async (_entity: unknown, row: unknown) => row),
    };
    const quiz = QuizEntity.reconstitute({
      id: 7,
      title: "Quiz",
      category: "English",
      visibleTo: "everyone",
      uiSettings: QuizEntity.defaultUiSettings,
      passingScore: 90,
      status: "published",
      version: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updated = await createRepository(manager).updateIfVersionMatches(
      7,
      quiz,
      3,
    );

    expect(quiz.version).toBe(4);
    expect(updated.version).toBe(4);
    expect(manager.save).toHaveBeenCalledWith(
      Quiz,
      expect.objectContaining({ version: 4 }),
    );
  });

  it("increments contents version once and rejects the previous version", async () => {
    const quizRow = {
      id: 7,
      title: "Quiz",
      category: "English",
      visibleTo: "everyone",
      passingScore: 90,
      status: "published",
      version: 3,
      uiSettings: QuizEntity.defaultUiSettings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const manager = {
      findOne: jest.fn(async () => quizRow),
      find: jest.fn().mockResolvedValue([]),
      save: jest.fn(async (_entity: unknown, row: Record<string, unknown>) => {
        Object.assign(quizRow, row);
        return quizRow;
      }),
    };
    const repository = createRepository(manager);
    const input = {
      quiz: { version: 3 },
      questions: [],
      deletedQuestionIds: [],
    };

    const saved = await repository.saveContents(7, input);

    expect(saved.quiz.version).toBe(4);
    await expect(repository.saveContents(7, input)).rejects.toMatchObject({
      statusCode: 409,
    });
    expect(manager.save).toHaveBeenCalledTimes(1);
  });
});
