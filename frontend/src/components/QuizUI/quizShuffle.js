function shuffled(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function hashSeed(value) {
  const text = String(value ?? "");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function prepareShuffledQuestions(
  questions,
  shuffleMode = "none",
  resultId = "",
) {
  const random = mulberry32(hashSeed(resultId));
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
