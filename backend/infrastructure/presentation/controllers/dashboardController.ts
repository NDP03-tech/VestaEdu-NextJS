import { HttpRequest, HttpResponse, NextFunction } from "./crud.controller";
import {
  PresentationHandlers,
  WorkflowController,
} from "./workflow.controller";

export class DashboardController extends WorkflowController {
  constructor(handlers: PresentationHandlers) {
    super(handlers);
  }

  getDashboardStats = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("getDashboardStats", req, res, next);
}
