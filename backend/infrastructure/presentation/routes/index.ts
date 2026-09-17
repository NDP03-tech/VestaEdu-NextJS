import { createCrudRouter } from "./crud.routes";
import type { ReturnTypeOfCreateCrudControllers } from "../types";

export function createPresentationRoutes(
  controllers: ReturnTypeOfCreateCrudControllers,
) {
  return {
    blog: createCrudRouter(controllers.blog),
    category: createCrudRouter(controllers.category),
    course: createCrudRouter(controllers.course),
    event: createCrudRouter(controllers.event),
    courseRegistration: createCrudRouter(controllers.courseRegistration),
    eventRegistration: createCrudRouter(controllers.eventRegistration),
    instructor: createCrudRouter(controllers.instructor),
    question: createCrudRouter(controllers.question),
    quiz: createCrudRouter(controllers.quiz),
  };
}
