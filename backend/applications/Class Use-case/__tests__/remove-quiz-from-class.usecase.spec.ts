import { RemoveQuizFromClassUseCase } from "../remove-quiz-from-class.usecase";
import { ClassNotFoundException } from "../class.exceptions";

describe("RemoveQuizFromClassUseCase", () => {
  it("deactivates the class assignment after confirming the class exists", async () => {
    const repository = {
      getById: jest.fn().mockResolvedValue({ id: 4 }),
      removeQuiz: jest.fn().mockResolvedValue(undefined),
    };

    await new RemoveQuizFromClassUseCase(repository as never).execute("4", 12);

    expect(repository.getById).toHaveBeenCalledWith("4");
    expect(repository.removeQuiz).toHaveBeenCalledWith("4", 12);
  });

  it("rejects removal for a missing class", async () => {
    const repository = {
      getById: jest.fn().mockResolvedValue(null),
      removeQuiz: jest.fn(),
    };

    await expect(
      new RemoveQuizFromClassUseCase(repository as never).execute("4", 12),
    ).rejects.toBeInstanceOf(ClassNotFoundException);
    expect(repository.removeQuiz).not.toHaveBeenCalled();
  });
});
