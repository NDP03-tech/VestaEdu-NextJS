import type {
  QuestionEntity,
  QuizEntity,
  UserQuizResultEntity,
} from "../../domain/entities";

type AttemptJson = ReturnType<UserQuizResultEntity["toJSON"]>;

export type StudentAttemptResponse = Omit<AttemptJson, "userId" | "answers"> & {
  answers?: Array<
    Pick<AttemptJson["answers"][number], "questionId" | "answer"> &
      Partial<
        Omit<AttemptJson["answers"][number], "questionId" | "answer">
      >
  >;
  reviewAnswers?: Array<{
    questionId: number;
    answer: unknown;
    isCorrect: boolean | null;
    score: number;
    requiresManualGrading: boolean;
    graderFeedback?: string | null;
    questionText: string | null;
    explanation: string | null;
    breakdown: ReturnType<QuestionEntity["grade"]>["breakdown"];
  }>;
};

export function toStudentAttemptResponse(
  result: UserQuizResultEntity,
  quiz?: QuizEntity,
  questions: QuestionEntity[] = [],
): StudentAttemptResponse {
  const { userId: _userId, answers: _answers, ...metadata } = result.toJSON();
  if (!result.isSubmitted()) {
    return {
      ...metadata,
      answers: result.answers.map(({ questionId, answer }) => ({
        questionId,
        answer,
      })),
    };
  }

  const revealAnswers =
    quiz !== undefined &&
    (quiz.uiSettings.mode !== "exam" || quiz.uiSettings.revealAnswers);
  if (!revealAnswers) return metadata;

  const questionsById = new Map(
    questions.map((question) => [question.id, question]),
  );
  const answers = result.answers;
  return {
    ...metadata,
    answers,
    reviewAnswers: answers.map((answer) => {
      const question = questionsById.get(answer.questionId);
      const grade = question?.grade(answer.answer);
      return {
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect: answer.isCorrect,
        score: answer.score,
        requiresManualGrading: answer.requiresManualGrading,
        graderFeedback: answer.graderFeedback ?? null,
        questionText: question?.questionText ?? null,
        explanation: question?.explanation ?? null,
        breakdown: grade?.requiresManualGrading ? [] : (grade?.breakdown ?? []),
      };
    }),
  };
}
