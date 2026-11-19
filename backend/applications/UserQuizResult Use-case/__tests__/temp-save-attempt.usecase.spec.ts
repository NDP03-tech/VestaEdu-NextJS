import { QuizEntity, UserQuizResultEntity } from "../../../domain/entities";
import { TempSaveAttemptUseCase } from "../temp-save-attempt.usecase";

describe("TempSaveAttemptUseCase", () => {
  it("allows the owner to save an attempt", async () => {
    const result = UserQuizResultEntity.create({
      userId: 3,
      quizId: 8,
      attemptNumber: 1,
    });
    const repository = {
      getById: jest.fn().mockResolvedValue(result),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const queries = {
      getQuiz: jest.fn(),
      getQuestions: jest.fn(),
    };
    const useCase = new TempSaveAttemptUseCase(repository as never, queries);

    await expect(useCase.execute("17", 3, [])).resolves.toMatchObject({
      quizId: 8,
      answers: [],
    });
    expect(repository.update).toHaveBeenCalledWith("17", result);
  });

  it("rejects another user's attempt without saving", async () => {
    const result = UserQuizResultEntity.create({
      userId: 3,
      quizId: 8,
      attemptNumber: 1,
    });
    const repository = {
      getById: jest.fn().mockResolvedValue(result),
      update: jest.fn(),
    };
    const queries = {
      getQuiz: jest.fn(),
      getQuestions: jest.fn(),
    };
    const useCase = new TempSaveAttemptUseCase(repository as never, queries);

    await expect(useCase.execute("17", 4, [])).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("auto-submits saved answers after an exam deadline and ignores new answers", async () => {
    const result = UserQuizResultEntity.create({
      userId: 3,
      quizId: 8,
      attemptNumber: 1,
      deadline: new Date(Date.now() - 31_000),
    });
    result.tempSave([{ questionId: 11, answer: "saved" }]);
    const repository = {
      getById: jest.fn().mockResolvedValue(result),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const queries = {
      getQuiz: jest
        .fn()
        .mockResolvedValue(QuizEntity.create({ uiSettings: { mode: "exam" } })),
      getQuestions: jest.fn().mockResolvedValue([]),
    };
    const useCase = new TempSaveAttemptUseCase(repository as never, queries);

    const submitted = await useCase.execute("17", 3, [
      { questionId: 11, answer: "late" },
    ]);

    expect(submitted.submittedAt).not.toBeNull();
    expect(submitted.submittedLate).toBe(true);
    expect(submitted).not.toHaveProperty("answers");
    expect(result.answers[0].answer).toBe("saved");
    expect(repository.update).toHaveBeenCalledWith("17", result);
  });
});
