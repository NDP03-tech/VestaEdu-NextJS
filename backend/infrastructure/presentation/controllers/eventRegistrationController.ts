import { CrudController, type CrudControllerUseCases } from "./crud.controller";

export class EventRegistrationController extends CrudController {
  constructor(useCases: CrudControllerUseCases) {
    super(useCases);
  }
}
