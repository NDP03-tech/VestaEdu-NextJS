import { QuestionEntity, UserQuizResultEntity } from "../../domain/entities";

jest.mock("../persistence/UserQuizResult", () => ({
  UserQuizResult: class UserQuizResult {},
}));

import { UserQuizResultMapper } from "./user-quiz-result.mapper";

describe("UserQuizResultMapper manual grading state", () => {
  it("clears needsManualGrading after all manual answers are graded", () => {
    const now = new Date();
    const question = QuestionEntity.reconstitute({
      id: 11,
      quizId: 8,
      questionType: "essay",
      questionText: "Explain your answer",
      points: 2,
      createdAt: now,
      updatedAt: now,
    });
    const result = UserQuizResultEntity.create({
      userId: 5,
      quizId: 8,
      attemptNumber: 1,
    });
    result.submit([question], [{ questionId: 11, answer: "Response" }], 70);

    expect(
      UserQuizResultMapper.toDomain(
        UserQuizResultMapper.toPersistence(result),
      ).needsManualGrading,
    ).toBe(true);

    result.applyManualGrade(11, 1, 2, 70, [question], "Good effort");
    expect(
      UserQuizResultMapper.toDomain(
        UserQuizResultMapper.toPersistence(result),
      ).needsManualGrading,
    ).toBe(false);
  });
});
