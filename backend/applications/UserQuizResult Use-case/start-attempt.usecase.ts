import { UserQuizResultEntity } from "../../domain/entities";
import type {
  AttemptDomainQueries,
  AttemptStartRepository,
} from "./user-quiz-result.specialized.use-case.interface";
import { QuizNotPublishedError } from "../Quiz Use-case";
import {
  AlreadyPassedError,
  NoAttemptsLeftError,
} from "./user-quiz-result.exceptions";
import { isPastAttemptDeadline } from "./attempt-deadline.helpers";

export class StartAttemptUseCase {
  constructor(
    private readonly startRepository: AttemptStartRepository,
    private readonly queries: Pick<AttemptDomainQueries, "getQuestions">,
  ) {}

  async execute(userId: number, quizId: number): Promise<UserQuizResultEntity> {
    const outcome = await this.startRepository.withUserQuizStartLock(
      userId,
      quizId,
      async (transaction) => {
        const quiz = await transaction.getQuiz();
        if (!quiz) throw new Error(`Quiz ${quizId} not found`);
        if (quiz.status !== "published") {
          throw new QuizNotPublishedError(
            "This quiz is not available to students",
          );
        }

        const activeAttempt = await transaction.getUnsubmittedAttempt();
        if (activeAttempt) {
          if (
            quiz.uiSettings.mode !== "exam" ||
            !isPastAttemptDeadline(activeAttempt.deadline)
          ) {
            return { result: activeAttempt };
          }

          activeAttempt.submit(
            await this.queries.getQuestions(quizId),
            activeAttempt.answers,
            quiz.passingScore,
            true,
          );
          await transaction.updateAttempt(activeAttempt);
        }

        if (quiz.uiSettings.mode === "exam") {
          if (await transaction.hasPassedAttempt()) {
            return { error: new AlreadyPassedError() };
          }

          const configuredMaxAttempts = quiz.uiSettings.maxAttempts;
          const maxAttempts =
            typeof configuredMaxAttempts === "number" &&
            Number.isSafeInteger(configuredMaxAttempts) &&
            configuredMaxAttempts >= 0
              ? configuredMaxAttempts
              : null;
          if (
            maxAttempts !== null &&
            transaction.counter.count >= maxAttempts
          ) {
            return { error: new NoAttemptsLeftError() };
          }
        }

        const nextAttemptNumber = transaction.counter.increment();
        await transaction.saveCounter();

        const timeLimit = Number(quiz.uiSettings.timeLimit);
        const now = new Date();
        const deadline =
          Number.isFinite(timeLimit) && timeLimit > 0
            ? new Date(now.getTime() + timeLimit * 60 * 1000)
            : null;
        const result = UserQuizResultEntity.create({
          userId,
          quizId,
          attemptNumber: nextAttemptNumber,
          quizVersion: quiz.version,
          deadline,
        });
        return { result: await transaction.createAttempt(result) };
      },
    );
    if ("error" in outcome) throw outcome.error;
    return outcome.result;
  }
}
