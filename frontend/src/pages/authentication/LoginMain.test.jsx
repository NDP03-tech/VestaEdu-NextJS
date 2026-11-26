import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginMain from "./LoginMain";
import { login } from "../../services/authService";

jest.mock("../../services/authService", () => ({
  login: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  Navigate: ({ to }) => <div data-testid="redirect" data-to={to} />,
}));

describe("LoginMain", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("accepts the API response envelope and stores the access token", async () => {
    login.mockResolvedValue({
      data: {
        data: {
          accessToken: "access-token",
          rawRefreshToken: "refresh-token",
          user: { id: 1, role: "admin" },
        },
      },
    });
    const setIsLoggedIn = jest.fn();
    const onLogin = jest.fn();

    render(<LoginMain setIsLoggedIn={setIsLoggedIn} onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Mật Khẩu"), {
      target: { value: "correct-password" },
    });
    fireEvent.submit(screen.getByLabelText("Email").closest("form"));

    await waitFor(() => {
      expect(screen.getByTestId("redirect")).toHaveAttribute("data-to", "/admin");
    });
    expect(login).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "correct-password",
    });
    expect(localStorage.getItem("token")).toBe("access-token");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-token");
    expect(localStorage.getItem("role")).toBe("admin");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual({
      id: 1,
      role: "admin",
    });
    expect(setIsLoggedIn).toHaveBeenCalledWith(true);
    expect(onLogin).toHaveBeenCalled();
  });
});
