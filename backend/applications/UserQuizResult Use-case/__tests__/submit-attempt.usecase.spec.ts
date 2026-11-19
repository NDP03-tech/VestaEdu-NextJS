import { QuizEntity, UserQuizResultEntity } from "../../../domain/entities";
import { SubmitAttemptUseCase } from "../submit-attempt.usecase";

describe("SubmitAttemptUseCase", () => {
  it("returns the persisted graded attempt for the API response", async () => {
    const result = UserQuizResultEntity.create({
      userId: 3,
      quizId: 8,
      attemptNumber: 1,
      quizVersion: 4,
    });
    const results = {
      getById: jest.fn().mockResolvedValue(result),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const queries = {
      getQuiz: jest.fn().mockResolvedValue(QuizEntity.create()),
      getQuestions: jest.fn().mockResolvedValue([]),
    };
    const useCase = new SubmitAttemptUseCase(results as never, queries);

    await expect(useCase.execute("17", [])).resolves.toBe(result);
    expect(results.update).toHaveBeenCalledWith("17", result);
  });
});
