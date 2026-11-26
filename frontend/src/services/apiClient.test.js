import apiClient from "./apiClient";

const originalAdapter = apiClient.defaults.adapter;

describe("apiClient authentication", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter;
  });

  it("adds the saved access token to authenticated requests", async () => {
    localStorage.setItem("token", "access-token");
    const adapter = jest.fn((config) =>
      Promise.resolve({
        config,
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
      }),
    );

    await apiClient.get("/api/me", { adapter });

    expect(adapter.mock.calls[0][0].headers.Authorization).toBe(
      "Bearer access-token",
    );
  });

  it("refreshes an expired access token and retries the request", async () => {
    localStorage.setItem("token", "expired-token");
    localStorage.setItem("refreshToken", "refresh-token");
    const adapter = jest.fn(async (config) => {
      if (config.url.includes("/api/refresh")) {
        return {
          config,
          data: { data: { accessToken: "renewed-token" } },
          status: 200,
          statusText: "OK",
          headers: {},
        };
      }

      if (config.headers.Authorization === "Bearer expired-token") {
        const error = new Error("Unauthorized");
        error.config = config;
        error.response = { status: 401, data: {}, config };
        throw error;
      }

      return {
        config,
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
      };
    });
    apiClient.defaults.adapter = adapter;

    await apiClient.get("/api/protected");

    expect(localStorage.getItem("token")).toBe("renewed-token");
    expect(
      adapter.mock.calls[2][0].headers.Authorization,
    ).toBe("Bearer renewed-token");
  });

  it("clears saved credentials when the refresh token is rejected", async () => {
    localStorage.setItem("token", "expired-token");
    localStorage.setItem("refreshToken", "invalid-refresh-token");
    apiClient.defaults.adapter = jest.fn(async (config) => {
      const error = new Error("Unauthorized");
      error.config = config;
      error.response = { status: 401, data: {}, config };
      throw error;
    });

    await expect(apiClient.get("/api/protected")).rejects.toThrow(
      "Unauthorized",
    );

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
  });
});
