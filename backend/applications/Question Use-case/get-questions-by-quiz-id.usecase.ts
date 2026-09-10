import type { QuestionQueryRepository } from "./question.specialized.use-case.interface";
import { normalizeQuestionId } from "./question.helpers";

export class GetQuestionsByQuizIdUseCase {
  constructor(private readonly repository: QuestionQueryRepository) {}
  async execute(quizId: string | number) {
    return this.repository.getByQuizId(normalizeQuestionId(quizId, "Question"));
  }
}
