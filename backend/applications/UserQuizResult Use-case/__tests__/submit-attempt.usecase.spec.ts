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

    const response = await useCase.execute("17", 3, []);

    expect(response).toMatchObject({
      quizId: 8,
      answers: [],
      reviewAnswers: [],
    });
    expect(results.update).toHaveBeenCalledWith("17", result);
  });

  it("rejects another user's attempt before grading or saving", async () => {
    const result = UserQuizResultEntity.create({
      userId: 3,
      quizId: 8,
      attemptNumber: 1,
    });
    const results = {
      getById: jest.fn().mockResolvedValue(result),
      update: jest.fn(),
    };
    const queries = {
      getQuiz: jest.fn(),
      getQuestions: jest.fn(),
    };
    const useCase = new SubmitAttemptUseCase(results as never, queries);

    await expect(useCase.execute("17", 4, [])).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(queries.getQuiz).not.toHaveBeenCalled();
    expect(results.update).not.toHaveBeenCalled();
  });

  it("submits only autosaved answers after an exam deadline grace period", async () => {
    const result = UserQuizResultEntity.create({
      userId: 3,
      quizId: 8,
      attemptNumber: 1,
      deadline: new Date(Date.now() - 31_000),
    });
    result.tempSave([{ questionId: 11, answer: "saved" }]);
    const results = {
      getById: jest.fn().mockResolvedValue(result),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const queries = {
      getQuiz: jest
        .fn()
        .mockResolvedValue(QuizEntity.create({ uiSettings: { mode: "exam" } })),
      getQuestions: jest.fn().mockResolvedValue([]),
    };
    const useCase = new SubmitAttemptUseCase(results as never, queries);

    const submitted = await useCase.execute("17", 3, [
      { questionId: 11, answer: "late" },
    ]);

    expect(submitted.submittedLate).toBe(true);
    expect(submitted).not.toHaveProperty("answers");
    expect(result.answers[0].answer).toBe("saved");
    expect(results.update).toHaveBeenCalledWith("17", result);
  });

  it("allows a practice attempt to submit after its deadline", async () => {
    const result = UserQuizResultEntity.create({
      userId: 3,
      quizId: 8,
      attemptNumber: 1,
      deadline: new Date(Date.now() - 31_000),
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

    const submitted = await useCase.execute("17", 3, [
      { questionId: 11, answer: "practice answer" },
    ]);

    expect(submitted.submittedLate).toBe(false);
    expect(submitted.answers[0].answer).toBe("practice answer");
    expect(submitted.reviewAnswers).toMatchObject([
      { questionId: 11, answer: "practice answer" },
    ]);
  });
});
