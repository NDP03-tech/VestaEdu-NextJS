import { CrudController, type CrudControllerUseCases } from "./crud.controller";

export class CourseController extends CrudController {
  constructor(useCases: CrudControllerUseCases) {
    super(useCases);
  }
}
