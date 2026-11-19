import {
  QuestionEntity,
  QuizEntity,
  UserQuizResultEntity,
} from "../../../domain/entities";
import { GradeAttemptUseCase } from "../grade-attempt.usecase";

function createQuestion(
  id: number,
  questionType: string,
  points: number,
  correctAnswer: unknown = null,
) {
  const now = new Date();
  return QuestionEntity.reconstitute({
    id,
    quizId: 8,
    questionType,
    questionText: `Question ${id}`,
    points,
    correctAnswer,
    createdAt: now,
    updatedAt: now,
  });
}

describe("GradeAttemptUseCase", () => {
  it("grades multiple manual answers, saves feedback, and recalculates the total", async () => {
    const questions = [
      createQuestion(101, "essay", 3),
      createQuestion(102, "speaking", 2),
      createQuestion(103, "multiple-choice", 2, "A"),
    ];
    const result = UserQuizResultEntity.create({
      userId: 5,
      quizId: 8,
      attemptNumber: 1,
    });
    result.submit(
      questions,
      [
        { questionId: 101, answer: "Written response" },
        { questionId: 102, answer: "Audio response" },
        { questionId: 103, answer: "A" },
      ],
      80,
    );
    const repository = {
      getById: jest.fn().mockResolvedValue(result),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const queries = {
      getQuiz: jest.fn().mockResolvedValue(QuizEntity.create({ passingScore: 80 })),
      getQuestions: jest.fn().mockResolvedValue(questions),
    };
    const useCase = new GradeAttemptUseCase(repository as never, queries);

    const graded = await useCase.execute("17", [
      { questionId: 101, score: 2, feedback: "Clear argument." },
      { questionId: 102, score: 1, feedback: "Improve pronunciation." },
    ]);

    expect(graded.score).toBe(71);
    expect(graded.passed).toBe(false);
    expect(graded.needsManualGrading).toBe(false);
    expect(graded.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          questionId: 101,
          score: 2,
          graderFeedback: "Clear argument.",
        }),
        expect.objectContaining({
          questionId: 102,
          score: 1,
          graderFeedback: "Improve pronunciation.",
        }),
      ]),
    );
    expect(repository.update).toHaveBeenCalledWith("17", result);
  });

  it("rejects scores above the question's maximum without saving", async () => {
    const question = createQuestion(101, "essay", 3);
    const result = UserQuizResultEntity.create({
      userId: 5,
      quizId: 8,
      attemptNumber: 1,
    });
    result.submit([question], [{ questionId: 101, answer: "Response" }], 80);
    const repository = {
      getById: jest.fn().mockResolvedValue(result),
      update: jest.fn(),
    };
    const queries = {
      getQuiz: jest.fn().mockResolvedValue(QuizEntity.create()),
      getQuestions: jest.fn().mockResolvedValue([question]),
    };
    const useCase = new GradeAttemptUseCase(repository as never, queries);

    await expect(
      useCase.execute("17", [{ questionId: 101, score: 4 }]),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("does not allow grading before an attempt is submitted", async () => {
    const result = UserQuizResultEntity.create({
      userId: 5,
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
    const useCase = new GradeAttemptUseCase(repository as never, queries);

    await expect(
      useCase.execute("17", [{ questionId: 101, score: 1 }]),
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(queries.getQuiz).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
  });
});
