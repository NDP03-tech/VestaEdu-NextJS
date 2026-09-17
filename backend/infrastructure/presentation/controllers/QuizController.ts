import { CrudController, type CrudControllerUseCases } from "./crud.controller";

export class QuizController extends CrudController {
  constructor(useCases: CrudControllerUseCases) {
    super(useCases);
  }
}
