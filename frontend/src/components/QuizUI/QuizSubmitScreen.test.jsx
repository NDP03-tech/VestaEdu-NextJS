import React from "react";
import { render, screen } from "@testing-library/react";
import QuizSubmitScreen from "./QuizSubmitScreen";

describe("QuizSubmitScreen answer review", () => {
  it("does not render answer review when the response has no review data", () => {
    render(<QuizSubmitScreen score={80} />);

    expect(
      screen.queryByRole("region", { name: "Answer review" }),
    ).not.toBeInTheDocument();
  });

  it("renders review only when review data is provided", () => {
    render(
      <QuizSubmitScreen
        score={80}
        reviewAnswers={[
          {
            questionId: 7,
            questionText: "Choose an answer",
            answer: "A",
            explanation: "This is the right choice.",
            breakdown: [{ correctAnswer: "B" }],
          },
        ]}
      />,
    );

    expect(screen.getByText("Answer review")).toBeInTheDocument();
    expect(screen.getByText("Correct answer: B")).toBeInTheDocument();
  });

  it("shows manual-grading status without a placeholder correct answer", () => {
    render(
      <QuizSubmitScreen
        reviewAnswers={[
          {
            questionId: 9,
            answer: "My response",
            requiresManualGrading: true,
            breakdown: [],
          },
        ]}
      />,
    );

    expect(screen.getByText("Awaiting manual grading.")).toBeInTheDocument();
    expect(screen.queryByText(/Correct answer:/)).not.toBeInTheDocument();
  });
});
