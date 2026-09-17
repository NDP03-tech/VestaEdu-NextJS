import { CrudController, type CrudControllerUseCases } from "./crud.controller";

export class QuestionController extends CrudController {
  constructor(useCases: CrudControllerUseCases) {
    super(useCases);
  }
}
