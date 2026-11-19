import { getEssayDisplayAnswer } from "./essayAnswer";

describe("getEssayDisplayAnswer", () => {
  it("uses the frozen answer first in review mode", () => {
    expect(
      getEssayDisplayAnswer(
        true,
        { essay: "Submitted essay" },
        { essay: "Current draft" },
      ),
    ).toBe("Submitted essay");
  });

  it("falls back to the initial answer when no frozen essay is present", () => {
    expect(
      getEssayDisplayAnswer(true, { essay: "" }, "Saved essay"),
    ).toBe("Saved essay");
  });

  it("uses only the initial answer in edit mode", () => {
    expect(
      getEssayDisplayAnswer(false, "Submitted essay", { essay: "Draft" }),
    ).toBe("Draft");
  });
});
