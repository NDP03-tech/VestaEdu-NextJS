import { prepareShuffledQuestions } from "./quizShuffle";

describe("prepareShuffledQuestions", () => {
  test("uses a stable, attempt-specific question order without mutating sources", () => {
    const questions = Array.from({ length: 8 }, (_, id) => ({ id }));
    const firstAttempt = prepareShuffledQuestions(
      questions,
      "questions",
      "attempt-a",
    ).map((question) => question.id);
    const sameAttempt = prepareShuffledQuestions(
      questions,
      "questions",
      "attempt-a",
    ).map((question) => question.id);
    const otherAttempt = prepareShuffledQuestions(
      questions,
      "questions",
      "attempt-b",
    ).map((question) => question.id);

    expect(sameAttempt).toEqual(firstAttempt);
    expect(otherAttempt).not.toEqual(firstAttempt);
    expect(questions.map((q) => q.id)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  test("shuffles displayed answers but keeps their original grading indices", () => {
    const question = {
      id: 1,
      options: [{ text: "A" }, { text: "B" }, { text: "C" }],
    };

    const [displayQuestion] = prepareShuffledQuestions(
      [question],
      "answers",
      "attempt-a",
    );

    expect(displayQuestion.options).toEqual(
      prepareShuffledQuestions([question], "answers", "attempt-a")[0].options,
    );
    expect(displayQuestion.options.map((option) => option.text)).not.toEqual([
      "A",
      "B",
      "C",
    ]);
    expect(displayQuestion.options.map((option) => option.answerIndex)).toEqual(
      displayQuestion.options.map((option) =>
        question.options.findIndex((original) => original.text === option.text),
      ),
    );
    expect(question.options[0]).toEqual({ text: "A" });
  });

  test("leaves both orders unchanged when shuffle is disabled", () => {
    const questions = [
      { id: 1, options: [{ text: "A" }, { text: "B" }] },
      { id: 2, options: [] },
    ];

    expect(prepareShuffledQuestions(questions, "none", "attempt-a")).toEqual(questions);
  });
});
