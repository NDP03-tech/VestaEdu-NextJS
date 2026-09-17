import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDomainFields20260917 implements MigrationInterface {
  name = "AddDomainFields20260917";

  async up(queryRunner: QueryRunner): Promise<void> {
    const quizzes = await queryRunner.getTable("quizzes");
    if (quizzes && !quizzes.findColumnByName("passingScore")) {
      await queryRunner.addColumn(
        quizzes,
        new TableColumn({
          name: "passingScore",
          type: "integer",
          default: 90,
          isNullable: false,
        }),
      );
    }

    const questions = await queryRunner.getTable("questions");
    if (!questions) return;

    if (!questions.findColumnByName("order")) {
      await queryRunner.addColumn(
        questions,
        new TableColumn({
          name: "order",
          type: "integer",
          default: 0,
          isNullable: false,
        }),
      );
    }
    if (!questions.findColumnByName("highlights")) {
      await queryRunner.addColumn(
        questions,
        new TableColumn({
          name: "highlights",
          type: "jsonb",
          isNullable: true,
        }),
      );
    }
    if (!questions.findColumnByName("correctAnswer")) {
      await queryRunner.addColumn(
        questions,
        new TableColumn({
          name: "correctAnswer",
          type: "jsonb",
          isNullable: true,
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const quizzes = await queryRunner.getTable("quizzes");
    if (quizzes?.findColumnByName("passingScore")) {
      await queryRunner.dropColumn(quizzes, "passingScore");
    }

    const questions = await queryRunner.getTable("questions");
    if (!questions) return;
    for (const column of ["correctAnswer", "highlights", "order"]) {
      if (questions.findColumnByName(column)) {
        await queryRunner.dropColumn(questions, column);
      }
    }
  }
}
