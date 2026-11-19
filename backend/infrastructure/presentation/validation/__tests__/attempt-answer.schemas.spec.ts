import {
  AttemptDraftSchema,
  AttemptSubmitSchema,
} from "../schemas";

describe("attempt answer schemas", () => {
  it("accepts and preserves the questionId contract", () => {
    const parsed = AttemptSubmitSchema.parse({
      answers: [{ questionId: 12, answer: "A", type: "multiple-choice" }],
    });

    expect(parsed.answers).toEqual([{ questionId: 12, answer: "A" }]);
  });

  it("normalizes the legacy question field to questionId", () => {
    const parsed = AttemptDraftSchema.parse({
      answers: [{ question: 12, answer: "A", type: "multiple-choice" }],
    });

    expect(parsed.answers).toEqual([{ questionId: 12, answer: "A" }]);
  });

  it("prefers questionId if both field names are sent", () => {
    const parsed = AttemptSubmitSchema.parse({
      answers: [{ questionId: 12, question: 99, answer: "A" }],
    });

    expect(parsed.answers).toEqual([{ questionId: 12, answer: "A" }]);
  });

  it("rejects answers without a question identifier", () => {
    expect(
      AttemptSubmitSchema.safeParse({ answers: [{ answer: "A" }] }).success,
    ).toBe(false);
  });

  it("rejects answers without an answer value", () => {
    expect(
      AttemptSubmitSchema.safeParse({ answers: [{ questionId: 12 }] }).success,
    ).toBe(false);
  });

  it("accepts draft state without requiring it for existing clients", () => {
    expect(
      AttemptDraftSchema.parse({
        answers: [],
        state: { currentQuestionId: 12 },
      }).state,
    ).toEqual({ currentQuestionId: 12 });
    expect(AttemptDraftSchema.parse({ answers: [] }).state).toBeUndefined();
  });
});
