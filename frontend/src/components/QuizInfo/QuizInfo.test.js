import React from "react";
import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import QuizInfo from "./QuizInfo";

jest.mock("axios", () => {
  const get = jest.fn().mockResolvedValue({ data: [] });
  return { __esModule: true, default: { get }, get };
});

describe("QuizInfo attempt settings", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
  });

  it("propagates the configured mode and passing score", async () => {
    const onQuizInfoChange = jest.fn();

    render(
      <QuizInfo
        quizId={8}
        quizInfo={{
          version: 4,
          passingScore: 75,
          uiSettings: { mode: "exam" },
        }}
        onQuizInfoChange={onQuizInfoChange}
      />,
    );

    await waitFor(() => {
      expect(onQuizInfoChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          version: 4,
          passingScore: 75,
          uiSettings: expect.objectContaining({ mode: "exam" }),
        }),
      );
    });
  });
});
