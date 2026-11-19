import {
  QuestionEntity,
  QuizEntity,
  UserQuizResultEntity,
} from "../../../domain/entities";
import { toStudentAttemptResponse } from "../student-attempt-response";

function createQuestion() {
  const now = new Date();
  return QuestionEntity.reconstitute({
    id: 11,
    quizId: 8,
    questionType: "multiple-choice",
    questionText: "Choose the correct option",
    correctAnswer: "correct",
    explanation: "The correct option is correct.",
    createdAt: now,
    updatedAt: now,
  });
}

function createSubmittedResult(question: QuestionEntity) {
  const result = UserQuizResultEntity.create({
    userId: 3,
    quizId: 8,
    attemptNumber: 1,
  });
  result.submit(
    [question],
    [{ questionId: question.id, answer: "wrong" }],
    70,
  );
  return result;
}

describe("toStudentAttemptResponse", () => {
  it("includes answer keys and explanations for practice submissions", () => {
    const question = createQuestion();
    const quiz = QuizEntity.create();
    const result = createSubmittedResult(question);

    const response = toStudentAttemptResponse(result, quiz, [question]);

    expect(response.reviewAnswers?.[0]).toMatchObject({
      questionId: 11,
      questionText: "Choose the correct option",
      explanation: "The correct option is correct.",
      breakdown: [{ correctAnswer: "correct", correct: false }],
    });
  });

  it("omits per-question results for exams until answers are revealed", () => {
    const question = createQuestion();
    const quiz = QuizEntity.create({ uiSettings: { mode: "exam" } });
    const result = createSubmittedResult(question);

    const response = toStudentAttemptResponse(result, quiz, [question]);

    expect(response).toMatchObject({ score: 0, passed: false });
    expect(response).not.toHaveProperty("answers");
    expect(response).not.toHaveProperty("reviewAnswers");
    expect(response).not.toHaveProperty("userId");
  });

  it("includes exam review only when the teacher enables revealAnswers", () => {
    const question = createQuestion();
    const quiz = QuizEntity.create({
      uiSettings: { mode: "exam", revealAnswers: true },
    });
    const result = createSubmittedResult(question);

    const response = toStudentAttemptResponse(result, quiz, [question]);

    expect(response.reviewAnswers?.[0].breakdown[0].correctAnswer).toBe(
      "correct",
    );
  });

  it("does not present a manual-grading placeholder as the correct answer", () => {
    const question = QuestionEntity.reconstitute({
      id: 11,
      quizId: 8,
      questionType: "essay",
      questionText: "Explain your answer",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const result = createSubmittedResult(question);
    const response = toStudentAttemptResponse(result, QuizEntity.create(), [
      question,
    ]);

    expect(response.reviewAnswers?.[0]).toMatchObject({
      requiresManualGrading: true,
      breakdown: [],
    });
  });

  it("keeps a student's own answers when resuming an unsubmitted exam", () => {
    const quiz = QuizEntity.create({ uiSettings: { mode: "exam" } });
    const result = UserQuizResultEntity.create({
      userId: 3,
      quizId: 8,
      attemptNumber: 1,
    });
    result.tempSave([{ questionId: 11, answer: "my answer" }]);

    const response = toStudentAttemptResponse(result, quiz);

    expect(response.answers).toEqual([
      { questionId: 11, answer: "my answer" },
    ]);
    expect(response).not.toHaveProperty("reviewAnswers");
  });
});
