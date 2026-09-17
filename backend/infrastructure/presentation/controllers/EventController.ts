import { CrudController, type CrudControllerUseCases } from "./crud.controller";

export class EventController extends CrudController {
  constructor(useCases: CrudControllerUseCases) {
    super(useCases);
  }
}
