import type {
  QuizEntity,
  QuestionEntity,
  UserQuizResultEntity,
  AttemptCounterEntity,
} from "../../domain/entities";
import type { RawAnswerInput } from "../../domain/entities/user-quiz-result.entity";

export interface AttemptQueryRepository {
  countAttempts(userId: number, quizId: number): Promise<number>;
  getByUserQuiz(
    userId: number,
    quizId: number,
  ): Promise<UserQuizResultEntity[]>;
  getLatest(
    userId: number,
    quizId: number,
  ): Promise<UserQuizResultEntity | null>;
  getBest(userId: number, quizId: number): Promise<UserQuizResultEntity | null>;
  getBestByQuiz(quizId: number): Promise<UserQuizResultEntity[]>;
  getBestByUser(userId: number): Promise<UserQuizResultEntity[]>;
  getStats(userId: number): Promise<Record<string, number>>;
  update(id: string): Promise<void>;
}

export interface AttemptDomainQueries {
  getQuiz(quizId: number): Promise<QuizEntity | null>;
  getQuestions(quizId: number): Promise<QuestionEntity[]>;
}

export interface AttemptCounterQueries {
  getByUserQuiz(
    userId: number,
    quizId: number,
  ): Promise<AttemptCounterEntity | null>;
  create(counter: AttemptCounterEntity): Promise<void>;
  update(id: string): Promise<void>;
}

export type RawAttemptAnswer = RawAnswerInput;
