import { HttpRequest, HttpResponse, NextFunction } from "./crud.controller";
import {
  PresentationHandlers,
  WorkflowController,
} from "./workflow.controller";

export class UserController extends WorkflowController {
  constructor(handlers: PresentationHandlers) {
    super(handlers);
  }

  login = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("login", req, res, next);
  register = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("register", req, res, next);
  createAdmin = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("createAdmin", req, res, next);
  getUsers = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("getUsers", req, res, next);
  addUser = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("addUser", req, res, next);
  updateUser = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("updateUser", req, res, next);
  deleteUser = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("deleteUser", req, res, next);
  refresh = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("refresh", req, res, next);
  logout = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("logout", req, res, next);
  me = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("me", req, res, next);
  getQuizzesForUser = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("getQuizzesForUser", req, res, next);
}
