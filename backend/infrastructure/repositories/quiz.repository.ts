import { DataSource, In, Repository } from "typeorm";
import { isQuizStatus, QuizEntity } from "../../domain/entities";
import {
  QuestionEntity,
  isValidQuestionType,
} from "../../domain/entities/question.entity";
import { quizRepository } from "../../domain/repositories/quiz.repository.interface";
import { Quiz } from "../persistence/Quiz";
import { QuizMapper } from "../mapper/quiz.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";
import { QuizQueryRepository } from "../../applications/Quiz Use-case/quiz.specialized.use-case.interface";
import { Question } from "../persistence/Question";
import { AttemptCounter } from "../persistence/AttemptCounter";
import { UserQuizResult } from "../persistence/UserQuizResult";
import { QuestionMapper } from "../mapper/question.mapper";
import type {
  SaveQuizContentsInput,
  SaveQuizContentsRepository,
} from "../../applications/Quiz Use-case/save-quiz-contents.usecase";
import { InputValidationError } from "../../applications/Quiz Use-case/save-quiz-contents.usecase";
import { QuizVersionConflictError } from "../../applications/Quiz Use-case/save-quiz-contents.usecase";

export class QuizRepository
  extends TypeOrmCrudRepository<QuizEntity, Quiz>
  implements quizRepository, QuizQueryRepository, SaveQuizContentsRepository
{
  constructor(
    repository: Repository<Quiz>,
    private readonly questionRepository: Repository<Question>,
    private readonly dataSource: DataSource,
  ) {
    super(repository, QuizMapper);
  }

  async getByCategory(category: string): Promise<QuizEntity[]> {
    const rows = await this.repository.findBy({ category });
    return rows.map((row) => QuizMapper.toDomain(row));
  }

  async createAndReturn(quiz: QuizEntity): Promise<QuizEntity> {
    const saved = await this.repository.save(this.mapper.toPersistence(quiz));
    return this.mapper.toDomain(saved);
  }

  async deleteQuestionsByQuizId(quizId: string): Promise<void> {
    await this.questionRepository.delete({ quiz_id: Number(quizId) });
  }

  async delete(id: string | number): Promise<void> {
    const quizId = Number(id);
    return this.dataSource.transaction(async (manager) => {
      const quiz = await manager.findOne(Quiz, {
        where: { id: quizId },
        lock: { mode: "pessimistic_write" },
      });
      if (!quiz) return;

      const resultCount = await manager.count(UserQuizResult, {
        where: { quiz_id: quizId },
      });
      const counterCount = await manager.count(AttemptCounter, {
        where: { quiz_id: quizId },
      });

      if (resultCount > 0 || counterCount > 0) {
        quiz.status = "archived";
        quiz.updatedAt = new Date();
        await manager.save(Quiz, quiz);
        return;
      }

      await manager.delete(Quiz, { id: quizId });
    });
  }

  async updateIfVersionMatches(
    id: string | number,
    entity: QuizEntity,
    expectedVersion: number,
  ): Promise<QuizEntity> {
    const quizId = Number(id);
    return this.dataSource.transaction(async (manager) => {
      const current = await manager.findOne(Quiz, {
        where: { id: quizId },
        lock: { mode: "pessimistic_write" },
      });
      if (!current) {
        const error = new Error(`Quiz ${quizId} not found`);
        error.name = "NotFoundError";
        throw error;
      }
      if (current.version !== expectedVersion) {
        throw new QuizVersionConflictError(
          "This quiz was changed by another teacher. Reload before saving.",
        );
      }

      entity.bumpVersion();
      const updated = QuizMapper.toPersistence(entity);
      updated.updatedAt = new Date();
      const saved = await manager.save(Quiz, updated);
      return QuizMapper.toDomain(saved);
    });
  }

  async saveContents(
    quizId: number,
    input: SaveQuizContentsInput,
  ): Promise<{ quiz: QuizEntity; questions: QuestionEntity[] }> {
    return this.dataSource.transaction(async (manager) => {
      const expectedVersion = Number(input.quiz.version);
      if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 1) {
        throw new InputValidationError("quiz.version is required");
      }

      const quizRow = await manager.findOne(Quiz, {
        where: { id: quizId },
        lock: { mode: "pessimistic_write" },
      });
      if (!quizRow) {
        const error = new Error(`Quiz ${quizId} not found`);
        error.name = "NotFoundError";
        throw error;
      }
      if (quizRow.version !== expectedVersion) {
        throw new QuizVersionConflictError(
          "This quiz was changed by another teacher. Reload before saving.",
        );
      }

      const quiz = QuizMapper.toDomain(quizRow);
      try {
        if (Object.prototype.hasOwnProperty.call(input.quiz, "title")) {
          quiz.rename(String(input.quiz.title ?? ""));
        }
        if (Object.prototype.hasOwnProperty.call(input.quiz, "category")) {
          quiz.setCategory(
            input.quiz.category == null ? null : String(input.quiz.category),
          );
        }
        if (Object.prototype.hasOwnProperty.call(input.quiz, "visibleTo")) {
          quiz.setVisibility(String(input.quiz.visibleTo));
        }
        if (Object.prototype.hasOwnProperty.call(input.quiz, "status")) {
          if (!isQuizStatus(input.quiz.status)) {
            throw new InputValidationError(
              "status must be draft, published, or archived",
            );
          }
          quiz.setStatus(input.quiz.status);
        }
        if (
          typeof input.quiz.uiSettings === "object" &&
          input.quiz.uiSettings !== null &&
          !Array.isArray(input.quiz.uiSettings)
        ) {
          quiz.updateUiSettings(
            input.quiz.uiSettings as Partial<QuizEntity["uiSettings"]>,
          );
        }
        if (Object.prototype.hasOwnProperty.call(input.quiz, "passingScore")) {
          quiz.setPassingScore(Number(input.quiz.passingScore));
        }
      } catch (error) {
        throw new InputValidationError(
          error instanceof Error ? error.message : "Invalid quiz data",
        );
      }

      if (input.deletedQuestionIds.length > 0) {
        const matchingQuestions = await manager.find(Question, {
          where: {
            id: In(input.deletedQuestionIds),
            quiz_id: quizId,
          },
        });
        if (matchingQuestions.length !== input.deletedQuestionIds.length) {
          const error = new Error("One or more questions do not belong to this quiz");
          error.name = "NotFoundError";
          throw error;
        }
        await manager.delete(Question, {
          id: In(input.deletedQuestionIds),
          quiz_id: quizId,
        });
      }

      for (const [index, rawQuestion] of input.questions.entries()) {
        const rawId = rawQuestion.id ?? rawQuestion.questionId;
        const hasQuestionId =
          rawId !== undefined && rawId !== null && rawId !== "";
        const questionId = Number(rawId);
        if (
          hasQuestionId &&
          (!Number.isSafeInteger(questionId) || questionId < 1)
        ) {
          throw new InputValidationError("Question id must be a positive integer");
        }
        const existingQuestion =
          hasQuestionId
            ? await manager.findOne(Question, {
                where: { id: questionId, quiz_id: quizId },
              })
            : null;
        if (hasQuestionId && !existingQuestion) {
          const error = new Error(
            `Question ${questionId} does not belong to quiz ${quizId}`,
          );
          error.name = "NotFoundError";
          throw error;
        }

        let questionEntity: QuestionEntity;
        try {
          questionEntity = QuestionEntity.create(
            normalizeQuestionInput(rawQuestion, quizId, index),
          );
        } catch (error) {
          throw new InputValidationError(
            error instanceof Error ? error.message : "Invalid question data",
          );
        }
        const questionRow = QuestionMapper.toPersistence(questionEntity);
        if (existingQuestion) {
          questionRow.id = existingQuestion.id;
          questionRow.createdAt = existingQuestion.createdAt;
          await manager.save(Question, questionRow);
        } else {
          const newQuestion = Object.assign(new Question(), questionRow);
          Reflect.deleteProperty(newQuestion, "id");
          await manager.save(Question, newQuestion);
        }
      }

      quiz.bumpVersion();
      const quizPersistence = QuizMapper.toPersistence(quiz);
      quizPersistence.updatedAt = new Date();
      const savedQuiz = await manager.save(Quiz, quizPersistence);
      const savedQuestions = await manager.find(Question, {
        where: { quiz_id: quizId },
        order: { order: "ASC", id: "ASC" },
      });

      return {
        quiz: QuizMapper.toDomain(savedQuiz),
        questions: savedQuestions.map((question) =>
          QuestionMapper.toDomain(question),
        ),
      };
    });
  }
}

function normalizeQuestionInput(
  input: Record<string, unknown>,
  quizId: number,
  index: number,
): Parameters<typeof QuestionEntity.create>[0] {
  const blueprint =
    typeof input.answerBlueprint === "object" &&
    input.answerBlueprint !== null &&
    !Array.isArray(input.answerBlueprint)
      ? (input.answerBlueprint as Record<string, unknown>)
      : {};
  const arrayValue = (value: unknown): Record<string, unknown>[] =>
    Array.isArray(value)
      ? value.filter(
          (item): item is Record<string, unknown> =>
            typeof item === "object" && item !== null && !Array.isArray(item),
        )
      : [];
  const pickArray = (camel: string, snake: string) =>
    arrayValue(blueprint[camel] ?? input[camel] ?? input[snake]);
  const stringArray = (value: unknown) =>
    Array.isArray(value) ? value.map(String) : [];
  const optionalNumber = (value: unknown) => {
    const number = Number(value);
    return value !== undefined && Number.isFinite(number) ? number : undefined;
  };

  const questionType = String(
    input.questionType ?? input.question_type ?? input.type ?? "",
  );
  if (!isValidQuestionType(questionType)) {
    throw new InputValidationError(`Invalid question type: ${questionType}`);
  }

  return {
    quizId,
    order: Number(input.order ?? index),
    questionType,
    questionText: String(input.questionText ?? input.question_text ?? ""),
    readingContent: String(
      input.readingContent ?? input.reading_content ?? "",
    ),
    explanation: String(input.explanation ?? ""),
    points: Number(input.points ?? 1),
    correctAnswer: input.correctAnswer ?? input.correct_answer,
    gaps: pickArray("gaps", "gaps").map((gap, gapIndex) => ({
      index: Number(gap.index ?? gapIndex),
      correctAnswers: stringArray(
        gap.correctAnswers ?? gap.correct_answers,
      ),
      position: optionalNumber(gap.position),
      length: optionalNumber(gap.length),
    })),
    dropdowns: pickArray("dropdowns", "dropdowns").map(
      (dropdown, dropdownIndex) => ({
        index: Number(dropdown.index ?? dropdownIndex),
        options: stringArray(dropdown.options),
        correctAnswer: String(
          dropdown.correctAnswer ?? dropdown.correct_answer ?? "",
        ),
      }),
    ),
    hintWords: pickArray("hintWords", "hint_words").map((hint, hintIndex) => ({
      index: Number(hint.index ?? hintIndex),
      word: String(hint.word ?? ""),
      hint: String(hint.hint ?? ""),
    })),
    highlights: pickArray("highlights", "highlights").map(
      (highlight, highlightIndex) => ({
        index: Number(highlight.index ?? highlightIndex),
        correctAnswers: stringArray(
          highlight.correctAnswers ?? highlight.correct_answers,
        ),
      }),
    ),
    options: pickArray("options", "options").map((option) => ({
      text: String(option.text ?? ""),
      isCorrect: Boolean(
        option.isCorrect ?? option.is_correct ?? option.correct,
      ),
    })),
  };
}
