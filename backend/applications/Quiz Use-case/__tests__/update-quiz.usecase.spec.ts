import { QuizEntity } from "../../../domain/entities";
import { QuizVersionConflictError } from "../save-quiz-contents.usecase";
import { UpdateQuizUseCase } from "../update-quiz.usecase";

describe("UpdateQuizUseCase", () => {
  it("uses the supplied version for optimistic updates", async () => {
    const quiz = QuizEntity.create({ title: "Quiz" });
    const repository = {
      getById: jest.fn().mockResolvedValue(quiz),
      updateIfVersionMatches: jest.fn(async (_id, entity) => {
        entity.bumpVersion();
        return entity;
      }),
    };
    const useCase = new UpdateQuizUseCase(repository as never);

    const updated = await useCase.execute("1", {
      title: "Updated",
      version: quiz.version,
    });

    expect(repository.updateIfVersionMatches).toHaveBeenCalledWith(
      "1",
      quiz,
      1,
    );
    expect(quiz.title).toBe("Updated");
    expect(updated.version).toBe(2);
  });

  it("rejects a missing version and surfaces a stale-version conflict", async () => {
    const quiz = QuizEntity.create({ title: "Quiz" });
    const repository = {
      getById: jest.fn().mockResolvedValue(quiz),
      updateIfVersionMatches: jest
        .fn()
        .mockRejectedValue(new QuizVersionConflictError("Reload the quiz")),
    };
    const useCase = new UpdateQuizUseCase(repository as never);

    await expect(
      useCase.execute("1", { title: "Updated", version: 0 }),
    ).rejects.toMatchObject({ statusCode: 400 });
    await expect(
      useCase.execute("1", { title: "Updated", version: quiz.version }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});
