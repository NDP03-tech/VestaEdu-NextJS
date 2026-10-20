import { createCrudRouter } from "./crud.routes";
import type { ReturnTypeOfCreateCrudControllers } from "../types";

/**
 * Helper to create all CRUD presentation routes at once.
 * Currently unused - routes are wired manually in index.ts for custom middleware per resource.
 * Kept for reference / future refactoring.
 */
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
