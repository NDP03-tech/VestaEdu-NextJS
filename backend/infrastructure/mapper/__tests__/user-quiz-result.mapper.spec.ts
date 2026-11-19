jest.mock("../../persistence/UserQuizResult", () => ({
  UserQuizResult: class {},
}));

import { UserQuizResultEntity } from "../../../domain/entities";
import { UserQuizResultMapper } from "../user-quiz-result.mapper";

describe("UserQuizResultMapper attempt metadata", () => {
  it("persists and restores version, deadline, and state", () => {
    const deadline = new Date("2026-11-18T10:00:00.000Z");
    const result = UserQuizResultEntity.create({
      userId: 4,
      quizId: 7,
      attemptNumber: 2,
      quizVersion: 3,
      deadline,
      state: { currentQuestionId: 12 },
    });
    result.tempSave([], { currentQuestionId: 15 });

    const persisted = UserQuizResultMapper.toPersistence(result);
    const restored = UserQuizResultMapper.toDomain(persisted);

    expect(persisted.quiz_version).toBe(3);
    expect(persisted.deadline).toEqual(deadline);
    expect(persisted.submitted_late).toBe(false);
    expect(persisted.state).toEqual({ currentQuestionId: 15 });
    expect(restored.quizVersion).toBe(3);
    expect(restored.deadline).toEqual(deadline);
    expect(restored.submittedLate).toBe(false);
    expect(restored.state).toEqual({ currentQuestionId: 15 });
  });
});
