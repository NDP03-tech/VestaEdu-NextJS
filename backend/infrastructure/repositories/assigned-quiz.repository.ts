import { Repository } from "typeorm";
import type { AssignedQuizRepository } from "../../applications/AssignedQuiz Use-case/assigned-quiz.use-case.interface";
import type { QuizEntity } from "../../domain/entities";
import { ClassStudent } from "../persistence/classStudents";
import { ClassQuiz } from "../persistence/ClassQuiz";
import { Quiz } from "../persistence/Quiz";
import { QuizMapper } from "../mapper/quiz.mapper";

export class AssignedQuizTypeOrmRepository implements AssignedQuizRepository {
  constructor(
    private readonly studentRepository: Repository<ClassStudent>,
    private readonly classQuizRepository: Repository<ClassQuiz>,
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  async getClassesByStudent(userId: number): Promise<number[]> {
    const rows = await this.studentRepository.findBy({
      user_id: userId,
      isActive: true,
    });
    return rows.map((row) => row.class_id);
  }

  async getQuizzesByClassIds(classIds: number[]): Promise<QuizEntity[]> {
    if (!classIds.length) return [];
    const assignments = await this.classQuizRepository
      .createQueryBuilder("assignment")
      .where("assignment.class_id IN (:...classIds)", { classIds })
      .andWhere("assignment.isActive = :isActive", { isActive: true })
      .getMany();
    const quizIds = [...new Set(assignments.map((row) => row.quiz_id))];
    if (!quizIds.length) return [];
    const quizzes = await this.quizRepository
      .createQueryBuilder("quiz")
      .where("quiz.id IN (:...quizIds)", { quizIds })
      .getMany();
    return quizzes.map((quiz) => QuizMapper.toDomain(quiz));
  }
}
