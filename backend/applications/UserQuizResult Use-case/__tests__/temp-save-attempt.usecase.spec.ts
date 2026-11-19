import { UserQuizResultEntity } from "../../../domain/entities";
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
    const useCase = new TempSaveAttemptUseCase(repository as never);

    await expect(useCase.execute("17", 3, [])).resolves.toBeUndefined();
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
    const useCase = new TempSaveAttemptUseCase(repository as never);

    await expect(useCase.execute("17", 4, [])).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(repository.update).not.toHaveBeenCalled();
  });
});
