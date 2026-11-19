const extractEssayText = (answer) => {
  if (typeof answer === "string") return answer;
  if (
    answer &&
    typeof answer === "object" &&
    !Array.isArray(answer) &&
    typeof answer.essay === "string"
  ) {
    return answer.essay;
  }
  return "";
};

export const getEssayDisplayAnswer = (
  showCorrectAnswer,
  frozenAnswer,
  initialAnswer,
) => {
  if (!showCorrectAnswer) return extractEssayText(initialAnswer);
  return extractEssayText(frozenAnswer) || extractEssayText(initialAnswer);
};
