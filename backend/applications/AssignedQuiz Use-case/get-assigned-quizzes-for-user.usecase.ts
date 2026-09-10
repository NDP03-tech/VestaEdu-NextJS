import type { AssignedQuizRepository } from "./assigned-quiz.use-case.interface";
export class GetAssignedQuizzesForUserUseCase {
  constructor(private readonly repository: AssignedQuizRepository) {}
  async execute(userId: number) {
    const quizzes = await this.repository.getQuizzesByClassIds(
      await this.repository.getClassesByStudent(userId),
    );
    return [...new Map(quizzes.map((quiz) => [quiz.id, quiz])).values()];
  }
}
