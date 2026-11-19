const questionSignature = (question) => {
  const blueprint = question.answerBlueprint || {};
  const array = (value) => (Array.isArray(value) ? value : []);
  const gaps = array(blueprint.gaps ?? question.gaps).map((gap, index) => ({
    index: gap.index ?? index,
    correctAnswers: gap.correctAnswers ?? gap.correct_answers ?? [],
    position: gap.position,
    length: gap.length,
  }));
  const dropdowns = array(blueprint.dropdowns ?? question.dropdowns).map(
    (dropdown, index) => ({
      index: dropdown.index ?? index,
      options: dropdown.options ?? [],
      correctAnswer: dropdown.correctAnswer ?? dropdown.correct_answer ?? "",
    }),
  );
  const hintWords = array(blueprint.hintWords ?? question.hintWords).map(
    (hint, index) => ({
      index: hint.index ?? index,
      word: hint.word ?? "",
      hint: hint.hint ?? "",
    }),
  );
  const highlights = array(blueprint.highlights ?? question.highlights).map(
    (highlight, index) => ({
      index: highlight.index ?? index,
      correctAnswers:
        highlight.correctAnswers ?? highlight.correct_answers ?? [],
    }),
  );
  const options = array(blueprint.options ?? question.options).map((option) => ({
    text: option.text ?? "",
    isCorrect: option.isCorrect ?? option.is_correct ?? option.correct ?? false,
  }));

  return JSON.stringify({
    order: question.order,
    questionType: question.questionType ?? question.question_type ?? "",
    questionText: question.questionText ?? question.question_text ?? "",
    readingContent: question.readingContent ?? question.reading_content ?? "",
    explanation: question.explanation ?? "",
    points: question.points ?? 1,
    correctAnswer: question.correctAnswer ?? question.correct_answer ?? null,
    gaps,
    dropdowns,
    hintWords,
    highlights,
    options,
  });
};

export function selectChangedQuestions(questions, originalQuestions) {
  const completeQuestions = questions
    .filter((question) =>
      (question.questionText ?? question.question_text ?? "").trim(),
    )
    .map((question, order) => {
      const id = question.id ?? question.questionId;
      return { ...question, ...(id ? { id } : {}), order };
    });
  const originalById = new Map(
    originalQuestions.map((question) => [
      String(question.id ?? question.questionId),
      question,
    ]),
  );

  return completeQuestions.filter((question) => {
    if (!question.id) return true;
    const original = originalById.get(String(question.id));
    return !original || questionSignature(question) !== questionSignature(original);
  });
}
