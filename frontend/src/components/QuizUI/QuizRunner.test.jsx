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

  it("uses the server deadline and retries failed automatic submission", async () => {
    const onSubmit = jest
      .fn()
      .mockRejectedValueOnce(new TypeError("Network unavailable"))
      .mockResolvedValueOnce(undefined);
    render(
      <QuizRunner
        questions={[{ id: 101 }]}
        timeLimit={60}
        deadline="2030-01-01T00:00:02.000Z"
        serverNow="2030-01-01T00:00:00.000Z"
        resultId="attempt-deadline"
        onSubmit={onSubmit}
        onAnswerChange={() => {}}
      />,
    );

    expect(screen.getByText("00:02")).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(onSubmit).toHaveBeenCalledWith({ automatic: true });
    expect(
      screen.getByText("Submission failed. Retrying automatically..."),
    ).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(3000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(onSubmit).toHaveBeenCalledTimes(2);
  });
});
