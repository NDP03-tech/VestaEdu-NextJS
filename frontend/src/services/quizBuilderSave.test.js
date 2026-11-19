import { selectChangedQuestions } from "./quizBuilderSave";

describe("selectChangedQuestions", () => {
  test("preserves separate questions with identical stems", () => {
    const questions = [
      { questionType: "multiple-choice", questionText: "Choose the answer" },
      { questionType: "multiple-choice", questionText: "Choose the answer" },
    ];

    expect(selectChangedQuestions(questions, [])).toHaveLength(2);
  });

  test("sends new and changed questions but omits unchanged questions", () => {
    const original = [
      {
        id: 1,
        order: 0,
        questionType: "essay",
        questionText: "First prompt",
        points: 2,
      },
      {
        id: 2,
        order: 1,
        questionType: "essay",
        questionText: "Second prompt",
        points: 2,
      },
    ];
    const questions = [
      original[0],
      { ...original[1], questionText: "Updated second prompt" },
      { questionType: "essay", questionText: "New prompt" },
    ];

    expect(selectChangedQuestions(questions, original)).toEqual([
      { ...original[1], questionText: "Updated second prompt", order: 1 },
      { questionType: "essay", questionText: "New prompt", order: 2 },
    ]);
  });

  test("includes unchanged questions whose order has shifted", () => {
    const original = [
      { id: 1, order: 0, questionType: "essay", questionText: "First" },
      { id: 2, order: 1, questionType: "essay", questionText: "Second" },
    ];

    expect(selectChangedQuestions([original[1]], original)).toEqual([
      { ...original[1], order: 0 },
    ]);
  });

  test("normalizes legacy questionId values instead of treating them as new", () => {
    const original = {
      questionId: 7,
      order: 0,
      questionType: "essay",
      questionText: "Existing question",
    };

    expect(selectChangedQuestions([original], [original])).toEqual([]);
  });
});
