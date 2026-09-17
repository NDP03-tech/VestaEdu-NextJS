import { CrudController, type CrudControllerUseCases } from "./crud.controller";

export class CourseRegistrationController extends CrudController {
  constructor(useCases: CrudControllerUseCases) {
    super(useCases);
  }
}
