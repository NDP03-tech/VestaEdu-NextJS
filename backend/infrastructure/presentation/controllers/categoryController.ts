import { CrudController, type CrudControllerUseCases } from "./crud.controller";

export class CategoryController extends CrudController {
  constructor(useCases: CrudControllerUseCases) {
    super(useCases);
  }
}
