import { HttpRequest, HttpResponse, NextFunction } from "./crud.controller";
import {
  PresentationHandlers,
  WorkflowController,
} from "./workflow.controller";

export class ClassController extends WorkflowController {
  constructor(handlers: PresentationHandlers) {
    super(handlers);
  }

  createClass = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("createClass", req, res, next);
  getAllClasses = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("getAllClasses", req, res, next);
  getClassById = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("getClassById", req, res, next);
  addUserToClass = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("addUserToClass", req, res, next);
  addStudentsToClass = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("addStudentsToClass", req, res, next);
  removeStudentFromClass = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("removeStudentFromClass", req, res, next);
  moveStudents = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("moveStudents", req, res, next);
  addQuizToClass = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("addQuizToClass", req, res, next);
  getStudentsInClass = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("getStudentsInClass", req, res, next);
  getQuizzesOfClass = (
    req: HttpRequest,
    res: HttpResponse,
    next: NextFunction,
  ) => this.handle("getQuizzesOfClass", req, res, next);
  updateClass = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("updateClass", req, res, next);
  deleteClass = (req: HttpRequest, res: HttpResponse, next: NextFunction) =>
    this.handle("deleteClass", req, res, next);
}
