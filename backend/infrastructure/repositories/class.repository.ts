import { Repository } from "typeorm";
import { ClassEntity } from "../../domain/entities";
import { classRepository } from "../../domain/repositories/class.repository.interface";
import { Class } from "../persistence/Class";
import { ClassStudent } from "../persistence/classStudents";
import { ClassQuiz } from "../persistence/ClassQuiz";
import { ClassMapper } from "../mapper/class.mapper";
import { ClassMembershipRepository } from "../../applications/Class Use-case/class.specialized.use-case.interface";

export class ClassRepository
  implements classRepository, ClassMembershipRepository
{
  constructor(
    private readonly repository: Repository<Class>,
    private readonly studentRepository: Repository<ClassStudent>,
    private readonly quizRepository: Repository<ClassQuiz>,
  ) {}

  async create(entity: ClassEntity): Promise<void> {
    const saved = await this.repository.save(ClassMapper.toPersistence(entity));
    await this.syncStudents(saved.id, entity.studentIds);
  }

  async getById(id: string | number): Promise<ClassEntity | null> {
    const orm = await this.repository.findOne({
      where: { id: Number(id) },
      relations: { classStudents: true },
    });
    return orm ? ClassMapper.toDomain(orm) : null;
  }

  async getAll(): Promise<ClassEntity[]> {
    const rows = await this.repository.find({
      relations: { classStudents: true },
    });
    return rows.map((row) => ClassMapper.toDomain(row));
  }

  async update(id: string | number, entity: ClassEntity): Promise<void> {
    const classId = Number(id);
    const orm = ClassMapper.toPersistence(entity);
    orm.id = classId;
    await this.repository.save(orm);
    await this.syncStudents(classId, entity.studentIds);
  }

  async delete(id: string | number): Promise<void> {
    await this.repository.delete(Number(id));
  }

  async addStudent(classId: string, studentId: number): Promise<void> {
    await this.addStudents(classId, [studentId]);
  }

  async addStudents(classId: string, studentIds: number[]): Promise<void> {
    const normalizedClassId = Number(classId);
    for (const studentId of studentIds) {
      const existing = await this.studentRepository.findOneBy({
        class_id: normalizedClassId,
        user_id: studentId,
      });
      if (existing) {
        existing.isActive = true;
        await this.studentRepository.save(existing);
        continue;
      }
      const row = new ClassStudent();
      row.class_id = normalizedClassId;
      row.user_id = studentId;
      row.isActive = true;
      await this.studentRepository.save(row);
    }
  }

  async removeStudent(classId: string, studentId: number): Promise<void> {
    await this.studentRepository.update(
      { class_id: Number(classId), user_id: studentId },
      { isActive: false },
    );
  }

  async moveStudents(
    fromClassId: string,
    toClassId: string,
    studentIds: number[],
  ): Promise<void> {
    await this.addStudents(toClassId, studentIds);
    for (const studentId of studentIds) {
      await this.removeStudent(fromClassId, studentId);
    }
  }

  async addQuiz(classId: string, quizId: number): Promise<void> {
    const normalizedClassId = Number(classId);
    const existing = await this.quizRepository.findOneBy({
      class_id: normalizedClassId,
      quiz_id: quizId,
    });
    if (existing) {
      existing.isActive = true;
      await this.quizRepository.save(existing);
      return;
    }
    const row = new ClassQuiz();
    row.class_id = normalizedClassId;
    row.quiz_id = quizId;
    row.isActive = true;
    await this.quizRepository.save(row);
  }

  async removeQuiz(classId: string, quizId: number): Promise<void> {
    await this.quizRepository.update(
      { class_id: Number(classId), quiz_id: quizId, isActive: true },
      { isActive: false },
    );
  }

  async getStudentIds(classId: string): Promise<number[]> {
    const rows = await this.studentRepository.findBy({
      class_id: Number(classId),
      isActive: true,
    });
    return rows.map((row) => row.user_id);
  }

  async getQuizIds(classId: string): Promise<number[]> {
    const rows = await this.quizRepository.findBy({
      class_id: Number(classId),
      isActive: true,
    });
    return rows.map((row) => row.quiz_id);
  }

  private async syncStudents(
    classId: number,
    studentIds: number[],
  ): Promise<void> {
    await this.studentRepository.delete({ class_id: classId });
    if (!studentIds.length) return;

    const rows = studentIds.map((userId) => {
      const row = new ClassStudent();
      row.class_id = classId;
      row.user_id = userId;
      row.isActive = true;
      return row;
    });
    await this.studentRepository.save(rows);
  }
}
