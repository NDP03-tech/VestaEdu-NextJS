import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import QuizRunner from "./QuizRunner";

jest.mock("../QuestionRenderer", () => ({
  __esModule: true,
  default: ({ question }) =>
    require("react").createElement(
      "div",
      { "data-testid": "rendered-question" },
      String(question.id),
    ),
}));

describe("QuizRunner attempt state", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("restores the current question and flags, then reports state changes", () => {
    const onAttemptStateChange = jest.fn();
    render(
      <QuizRunner
        questions={[{ id: 101 }, { id: 202 }]}
        onePerPage
        timeLimit={2}
        resultId="attempt-42"
        initialState={{
          currentQuestion: 202,
          flagged: [202],
          elapsed: 15,
        }}
        onAttemptStateChange={onAttemptStateChange}
        onAnswerChange={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(screen.getByText("Câu hỏi 2 / 2")).toBeInTheDocument();
    expect(screen.getByTestId("rendered-question")).toHaveTextContent("202");
    expect(screen.getByText("01:45")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Unmark question for review" }),
    );
    expect(onAttemptStateChange).toHaveBeenLastCalledWith({
      currentQuestion: 202,
      flagged: [],
      elapsed: 15,
    });

    fireEvent.click(screen.getByRole("button", { name: "← Câu trước" }));
    expect(onAttemptStateChange).toHaveBeenLastCalledWith({
      currentQuestion: 101,
      flagged: [],
      elapsed: 15,
    });

    act(() => {
      jest.advanceTimersByTime(15_000);
    });
    expect(onAttemptStateChange).toHaveBeenLastCalledWith({
      currentQuestion: 101,
      flagged: [],
      elapsed: 30,
    });
  });
});
