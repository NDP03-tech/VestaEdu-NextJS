import { InputValidationError, SaveQuizContentsUseCase } from "../../applications/Quiz Use-case";

describe("SaveQuizContentsUseCase", () => {
  test("forwards every question, including duplicate stems, in one save request", async () => {
    const result = { quiz: {} as never, questions: [] };
    const repository = {
      saveContents: jest.fn().mockResolvedValue(result),
    };
    const useCase = new SaveQuizContentsUseCase(repository);
    const questions = [
      { questionType: "essay", questionText: "Repeated stem" },
      { questionType: "essay", questionText: "Repeated stem" },
    ];

    await expect(
      useCase.execute("1", {
        quiz: { title: "Quiz", version: 3 },
        questions,
        deletedQuestionIds: [],
      }),
    ).resolves.toBe(result);
    expect(repository.saveContents).toHaveBeenCalledWith(1, {
      quiz: { title: "Quiz", version: 3 },
      questions,
      deletedQuestionIds: [],
    });
  });

  test("rejects malformed question lists before reaching persistence", () => {
    const repository = { saveContents: jest.fn() };
    const useCase = new SaveQuizContentsUseCase(repository);

    expect(() =>
      useCase.execute("1", {
        quiz: { version: 1 },
        questions: [null],
        deletedQuestionIds: [],
      }),
    ).toThrow(InputValidationError);
    expect(repository.saveContents).not.toHaveBeenCalled();
  });

  test("requires a quiz version for optimistic conflict checks", () => {
    const repository = { saveContents: jest.fn() };
    const useCase = new SaveQuizContentsUseCase(repository);

    expect(() =>
      useCase.execute("1", {
        quiz: {},
        questions: [],
        deletedQuestionIds: [],
      }),
    ).toThrow(InputValidationError);
    expect(repository.saveContents).not.toHaveBeenCalled();
  });
});
