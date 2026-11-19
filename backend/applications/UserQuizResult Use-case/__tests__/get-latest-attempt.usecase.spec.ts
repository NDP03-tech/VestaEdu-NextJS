import { QuizEntity, UserQuizResultEntity } from "../../../domain/entities";
import { GetLatestAttemptUseCase } from "../get-latest-attempt.usecase";

describe("GetLatestAttemptUseCase", () => {
  it("does not auto-submit overdue practice attempts", async () => {
    const result = UserQuizResultEntity.create({
      userId: 3,
      quizId: 8,
      attemptNumber: 1,
      deadline: new Date(Date.now() - 31_000),
    });
    const repository = {
      getLatest: jest.fn().mockResolvedValue(result),
      update: jest.fn(),
    };
    const queries = {
      getQuiz: jest.fn().mockResolvedValue(QuizEntity.create()),
      getQuestions: jest.fn(),
    };
    const useCase = new GetLatestAttemptUseCase(repository as never, queries);

    await expect(useCase.execute(3, 8)).resolves.toBe(result);
    expect(repository.update).not.toHaveBeenCalled();
    expect(queries.getQuestions).not.toHaveBeenCalled();
  });

  it("auto-submits overdue exam attempts from saved answers", async () => {
    const result = UserQuizResultEntity.create({
      userId: 3,
      quizId: 8,
      attemptNumber: 1,
      deadline: new Date(Date.now() - 31_000),
    });
    result.tempSave([{ questionId: 11, answer: "saved" }]);
    const repository = {
      getLatest: jest.fn().mockResolvedValue(result),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const queries = {
      getQuiz: jest
        .fn()
        .mockResolvedValue(QuizEntity.create({ uiSettings: { mode: "exam" } })),
      getQuestions: jest.fn().mockResolvedValue([]),
    };
    const useCase = new GetLatestAttemptUseCase(
      repository as never,
      queries,
    );

    const latest = await useCase.execute(3, 8);

    expect(latest?.submittedLate).toBe(true);
    expect(latest?.answers[0].answer).toBe("saved");
    expect(repository.update).toHaveBeenCalledWith(result.id, result);
  });
});
