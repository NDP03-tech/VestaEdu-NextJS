import type { quizRepository } from "../../domain/repositories/quiz.repository.interface";
import type { QuizQueryRepository } from "./quiz.specialized.use-case.interface";
import { QuizNotFoundException } from "./quiz.exceptions";
import { normalizeQuizId } from "./quiz.helpers";

export class DeleteQuizWithQuestionsUseCase {
  constructor(
    private readonly quizRepository: quizRepository,
    private readonly queryRepository: QuizQueryRepository,
  ) {}
  async execute(id: string | number): Promise<void> {
    const key = normalizeQuizId(id, "Quiz");
    if (!(await this.quizRepository.getById(key)))
      throw new QuizNotFoundException(key);
    await this.queryRepository.deleteQuestionsByQuizId(key);
    await this.quizRepository.delete(key);
  }
}
