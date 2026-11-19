import { HttpRequest, HttpResponse, NextFunction } from "./crud.controller";
import {
  PresentationHandlers,
  WorkflowController,
} from "./workflow.controller";

export class UserQuizResultController extends WorkflowController {
  constructor(handlers: PresentationHandlers) {
    super(handlers);
  }

  startAttempt = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("startAttempt", req, res, next);
  tempSave = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("tempSave", req, res, next);
  submitAttempt = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("submitAttempt", req, res, next);
  gradeAttempt = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("gradeAttempt", req, res, next);
  getLatestResult = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("getLatestResult", req, res, next);
  getAllAttempts = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("getAllAttempts", req, res, next);
  getUserResultsStats = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("getUserResultsStats", req, res, next);
  getUsersBestAttemptsByQuiz = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("getUsersBestAttemptsByQuiz", req, res, next);
  getUserQuizBestAttempt = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("getUserQuizBestAttempt", req, res, next);
  getUserQuizSummaryByUserId = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("getUserQuizSummaryByUserId", req, res, next);
  getBestAttemptsByQuiz = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("getBestAttemptsByQuiz", req, res, next);
  getBestAttemptsByUserId = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("getBestAttemptsByUserId", req, res, next);
}
