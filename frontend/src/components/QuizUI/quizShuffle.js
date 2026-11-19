function shuffled(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function prepareShuffledQuestions(
  questions,
  shuffleMode = "none",
  random = Math.random,
) {
  const shuffleQuestionOrder =
    shuffleMode === "questions" || shuffleMode === "both";
  const shuffleAnswerOrder =
    shuffleMode === "answers" || shuffleMode === "both";

  const displayQuestions = questions.map((question) => {
    if (!shuffleAnswerOrder || !Array.isArray(question.options)) {
      return question;
    }

    const options = shuffled(
      question.options.map((option, answerIndex) => ({
        ...option,
        answerIndex,
      })),
      random,
    );
    return { ...question, options };
  });

  return shuffleQuestionOrder
    ? shuffled(displayQuestions, random)
    : displayQuestions;
}
