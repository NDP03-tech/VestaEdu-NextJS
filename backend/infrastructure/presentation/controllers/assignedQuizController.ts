import { HttpRequest, HttpResponse, NextFunction } from "./crud.controller";
import {
  PresentationHandlers,
  WorkflowController,
} from "./workflow.controller";

export class AssignedQuizController extends WorkflowController {
  constructor(handlers: PresentationHandlers) {
    super(handlers);
  }

  getAssignedQuizzes = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("getAssignedQuizzes", req, res, next);
}
