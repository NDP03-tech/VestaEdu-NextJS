import { HttpRequest, HttpResponse, NextFunction } from "./crud.controller";

export type PresentationHandler = (request: HttpRequest) => Promise<unknown>;

export type PresentationHandlers = Record<string, PresentationHandler>;

export abstract class WorkflowController {
  protected constructor(private readonly handlers: PresentationHandlers) {}

  protected handle(
    name: string,
    request: HttpRequest,
    response: HttpResponse,
    next: NextFunction,
  ): void {
    void this.execute(name, request, response, next);
  }

  private async execute(
    name: string,
    request: HttpRequest,
    response: HttpResponse,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.handlers[name](request);
      response.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}
