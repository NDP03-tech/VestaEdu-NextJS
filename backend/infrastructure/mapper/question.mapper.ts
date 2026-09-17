import { QuestionEntity } from "../../domain/entities";
import {
  Question,
  QuestionType as PersistenceQuestionType,
} from "../persistence/Question";

export class QuestionMapper {
  static toDomain(orm: Question): QuestionEntity {
    return QuestionEntity.reconstitute({
      id: orm.id,
      quizId: orm.quiz_id,
      order: orm.order,
      questionType: orm.question_type,
      questionText: orm.question_text,
      readingContent: orm.readingContent,
      points: orm.points,
      explanation: orm.explanation,
      answerBlueprint: {
        gaps: orm.gaps ?? [],
        dropdowns: orm.dropdowns ?? [],
        hintWords: orm.hintWords ?? [],
        highlights: orm.highlights ?? [],
        options: orm.options ?? [],
      },
      correctAnswer: orm.correctAnswer,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(question: QuestionEntity): Question {
    const orm = new Question();
    orm.id = question.id;
    orm.quiz_id = question.quizId;
    orm.question_type = question.questionType as PersistenceQuestionType;
    orm.question_text = question.questionText;
    orm.order = question.order;
    orm.readingContent = question.readingContent;
    orm.points = question.points;
    orm.explanation = question.explanation;
    orm.gaps = question.gaps;
    orm.dropdowns = question.dropdowns;
    orm.hintWords = question.hintWords;
    orm.options = question.options;
    orm.highlights = question.highlights;
    orm.correctAnswer = question.correctAnswer;
    orm.createdAt = question.createdAt;
    orm.updatedAt = question.updatedAt;
    return orm;
  }
}
