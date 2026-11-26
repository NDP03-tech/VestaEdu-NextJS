jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const authenticateToken = require("../authenticateToken");

const createResponse = () => {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
};

describe("authenticateToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 for an expired or invalid bearer token", () => {
    jwt.verify.mockImplementation((_token, _secret, callback) => {
      callback(new Error("jwt expired"));
    });
    const request = {
      headers: { authorization: "Bearer expired-token", cookie: "" },
    };
    const response = createResponse();
    const next = jest.fn();

    authenticateToken(request, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      message: "Token không hợp lệ.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("sets the decoded user and continues for a valid bearer token", () => {
    const user = { id: 1, role: "admin" };
    jwt.verify.mockImplementation((_token, _secret, callback) => {
      callback(null, user);
    });
    const request = {
      headers: { authorization: "Bearer valid-token", cookie: "" },
    };
    const response = createResponse();
    const next = jest.fn();

    authenticateToken(request, response, next);

    expect(request.user).toEqual(user);
    expect(next).toHaveBeenCalledTimes(1);
    expect(response.status).not.toHaveBeenCalled();
  });
});
