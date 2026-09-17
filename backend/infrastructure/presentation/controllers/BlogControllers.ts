import { CrudController, type CrudControllerUseCases } from "./crud.controller";

export class BlogController extends CrudController {
  constructor(useCases: CrudControllerUseCases) {
    super(useCases);
  }
}
