import { CrudController, type CrudControllerUseCases } from "./crud.controller";

export class InstructorController extends CrudController {
  constructor(useCases: CrudControllerUseCases) {
    super(useCases);
  }
}
