import { validateRequest } from "../../../middleware/validateRequest";
import { CreateCategorySchema } from "../validation/schemas";
import { Request, Response } from "express";

describe("validateRequest middleware", () => {
  it("should pass when schema validation succeeds", () => {
    const middleware = validateRequest({ body: CreateCategorySchema });
    const req = {
      body: { name: "Mathematics", description: "All math quizzes" },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("should return 400 when body is missing required fields", () => {
    const middleware = validateRequest({ body: CreateCategorySchema });
    const req = { body: {} } as unknown as Request;
    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn();
    const res = { status: statusMock, json: jsonMock } as unknown as Response;
    const next = jest.fn();

    middleware(req, res, next);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation failed",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});

