import { prepareShuffledQuestions } from "./quizShuffle";

describe("prepareShuffledQuestions", () => {
  test("shuffles question order without mutating source questions", () => {
    const questions = [{ id: 1 }, { id: 2 }, { id: 3 }];

    expect(prepareShuffledQuestions(questions, "questions", () => 0).map((q) => q.id))
      .toEqual([2, 3, 1]);
    expect(questions.map((q) => q.id)).toEqual([1, 2, 3]);
  });

  test("shuffles displayed answers but keeps their original grading indices", () => {
    const question = {
      id: 1,
      options: [{ text: "A" }, { text: "B" }, { text: "C" }],
    };

    const [displayQuestion] = prepareShuffledQuestions(
      [question],
      "answers",
      () => 0,
    );

    expect(displayQuestion.options.map((option) => option.text)).toEqual([
      "B",
      "C",
      "A",
    ]);
    expect(
      displayQuestion.options.map((option) => option.answerIndex),
    ).toEqual([1, 2, 0]);
    expect(question.options[0]).toEqual({ text: "A" });
  });

  test("leaves both orders unchanged when shuffle is disabled", () => {
    const questions = [
      { id: 1, options: [{ text: "A" }, { text: "B" }] },
      { id: 2, options: [] },
    ];

    expect(prepareShuffledQuestions(questions, "none", () => 0)).toEqual(
      questions,
    );
  });
});
