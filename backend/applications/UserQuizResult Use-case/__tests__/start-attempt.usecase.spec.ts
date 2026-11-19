import { QuizEntity } from "../../../domain/entities";
import { StartAttemptUseCase } from "../start-attempt.usecase";

describe("StartAttemptUseCase", () => {
  it("sets a deadline from the quiz time limit", async () => {
    const quiz = QuizEntity.create({ uiSettings: { timeLimit: 45 } });
    const results = { create: jest.fn() };
    const counters = {
      getByUserQuiz: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
    };
    const quizQueries = { getQuiz: jest.fn().mockResolvedValue(quiz) };
    const useCase = new StartAttemptUseCase(
      results as never,
      {} as never,
      counters as never,
      quizQueries,
    );
    const startedAt = Date.now();

    const result = await useCase.execute(3, 8);

    expect(result.deadline?.getTime()).toBeGreaterThanOrEqual(
      startedAt + 45 * 60 * 1000,
    );
    expect(result.deadline?.getTime()).toBeLessThanOrEqual(
      Date.now() + 45 * 60 * 1000,
    );
    expect(result.quizVersion).toBe(quiz.version);
    expect(result.state).toEqual({});
    expect(results.create).toHaveBeenCalledWith(result);
  });

  it("does not set a deadline when the quiz has no time limit", async () => {
    const quiz = QuizEntity.create({ uiSettings: { timeLimit: 0 } });
    const useCase = new StartAttemptUseCase(
      { create: jest.fn() } as never,
      {} as never,
      {
        getByUserQuiz: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
        update: jest.fn(),
      } as never,
      { getQuiz: jest.fn().mockResolvedValue(quiz) },
    );

    const result = await useCase.execute(3, 8);

    expect(result.deadline).toBeNull();
  });

  it("rejects attempts for draft quizzes before creating counters or results", async () => {
    const quiz = QuizEntity.create();
    quiz.setStatus("draft");
    const results = { create: jest.fn() };
    const counters = {
      getByUserQuiz: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    const useCase = new StartAttemptUseCase(
      results as never,
      {} as never,
      counters as never,
      { getQuiz: jest.fn().mockResolvedValue(quiz) },
    );

    await expect(useCase.execute(3, 8)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(counters.getByUserQuiz).not.toHaveBeenCalled();
    expect(results.create).not.toHaveBeenCalled();
  });
});
