import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import type {
  QuestionEntity,
  UserQuizResultEntity,
} from "../../domain/entities";
import type { AttemptDomainQueries } from "./user-quiz-result.specialized.use-case.interface";
import {
  AttemptNotSubmittedError,
  ManualGradeValidationError,
  UserQuizResultNotFoundException,
} from "./user-quiz-result.exceptions";
import { normalizeEntityId } from "../use-case.helpers";

export interface ManualGradeInput {
  questionId: number;
  score: number;
  feedback?: string;
}

export class GradeAttemptUseCase {
  constructor(
    private readonly results: userQuizResultRepository,
    private readonly queries: AttemptDomainQueries,
  ) {}

  async execute(
    resultId: string | number,
    grades: ManualGradeInput[],
  ): Promise<ReturnType<UserQuizResultEntity["toJSON"]>> {
    const key = normalizeEntityId(resultId, "UserQuizResult");
    const result = await this.results.getById(key);
    if (!result) throw new UserQuizResultNotFoundException(key);
    if (!result.isSubmitted()) throw new AttemptNotSubmittedError();

    if (!Array.isArray(grades) || grades.length === 0) {
      throw new ManualGradeValidationError("At least one grade is required");
    }

    const quiz = await this.queries.getQuiz(result.quizId);
    if (!quiz) throw new Error(`Quiz ${result.quizId} not found`);
    const questions = await this.queries.getQuestions(result.quizId);
    const questionsById = new Map(
      questions.map((question) => [question.id, question]),
    );
    const gradedQuestionIds = new Set<number>();
    const validatedGrades: Array<{
      grade: ManualGradeInput;
      question: QuestionEntity;
    }> = [];

    for (const grade of grades) {
      if (gradedQuestionIds.has(grade.questionId)) {
        throw new ManualGradeValidationError(
          `Question ${grade.questionId} was graded more than once`,
        );
      }
      gradedQuestionIds.add(grade.questionId);

      const question = questionsById.get(grade.questionId);
      if (!question || !question.requiresManualGrading) {
        throw new ManualGradeValidationError(
          `Question ${grade.questionId} does not require manual grading`,
        );
      }
      if (!result.answers.some((answer) => answer.questionId === grade.questionId)) {
        throw new ManualGradeValidationError(
          `Attempt has no answer for question ${grade.questionId}`,
        );
      }
      if (
        !Number.isFinite(grade.score) ||
        grade.score < 0 ||
        grade.score > question.points
      ) {
        throw new ManualGradeValidationError(
          `Score for question ${grade.questionId} must be between 0 and ${question.points}`,
        );
      }
      if (grade.feedback !== undefined && typeof grade.feedback !== "string") {
        throw new ManualGradeValidationError(
          `Feedback for question ${grade.questionId} must be text`,
        );
      }
      validatedGrades.push({ grade, question });
    }

    for (const { grade, question } of validatedGrades) {
      result.applyManualGrade(
        grade.questionId,
        grade.score,
        question.points,
        quiz.passingScore,
        questions,
        grade.feedback,
      );
    }

    await this.results.update(key, result);
    return result.toJSON();
  }
}
