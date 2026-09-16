export * from "./course-registration.use-case.interface";
export { CreateCourseRegistrationUseCase } from "./create-course-registration.usecase";
export {
  GetCourseRegistrationByIdUseCase,
  GetCourseRegistrationByIdUseCase as GetCourseRegistrationUseCase,
} from "./get-course-registration-by-id.usecase";
export {
  GetAllCourseRegistrationsUseCase,
  GetAllCourseRegistrationsUseCase as ListCourseRegistrationsUseCase,
} from "./get-all-course-registrations.usecase";
export { UpdateCourseRegistrationUseCase } from "./update-course-registration.usecase";
export { DeleteCourseRegistrationUseCase } from "./delete-course-registration.usecase";
export * from "./course-registration.specialized.use-case.interface";
export { RegisterCourseUseCase } from "./register-course.usecase";
