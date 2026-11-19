import type { QuestionEntity } from "../../../domain/entities/question.entity";

function sanitizeQuestionText(questionText: string): string {
  return questionText.replace(
    /\s+data-(?:correct-)?answers?(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi,
    "",
  );
}

export function toStudentQuestionDto(question: QuestionEntity) {
  const data = question.toJSON();
  const questionText = sanitizeQuestionText(data.questionText);

  return {
    id: data.id,
    quizId: data.quizId,
    quiz_id: data.quizId,
    order: data.order,
    questionType: data.questionType,
    question_type: data.questionType,
    questionText,
    question_text: questionText,
    readingContent: data.readingContent,
    reading_content: data.readingContent,
    points: data.points,
    gaps: data.gaps.map(({ index, position, length }) => ({
      index,
      position,
      length,
    })),
    dropdowns: data.dropdowns.map(({ index, options }) => ({
      index,
      options,
    })),
    hintWords: data.hintWords.map(({ index, hint }) => ({ index, hint })),
    highlights: data.highlights.map(({ index }) => ({ index })),
    options: data.options.map(({ text }) => ({ text })),
    studentSafe: true,
  };
}

export function toTeacherQuestionDto(question: QuestionEntity) {
  const data = question.toJSON();

  return {
    ...data,
    quiz_id: data.quizId,
    question_type: data.questionType,
    question_text: data.questionText,
    reading_content: data.readingContent,
    gaps: data.gaps.map((gap) => ({
      ...gap,
      correct_answers: gap.correctAnswers,
    })),
    dropdowns: data.dropdowns.map((dropdown) => ({
      ...dropdown,
      correct_answer: dropdown.correctAnswer,
    })),
    options: data.options.map((option) => ({
      ...option,
      is_correct: option.isCorrect,
    })),
  };
}
