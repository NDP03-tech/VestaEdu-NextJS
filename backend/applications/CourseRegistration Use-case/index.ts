import { CourseRegistrationEntity } from "../../domain/entities";
import type { courseRegistrationRepository } from "../../domain/repositories/course-registration.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";
export type CreateCourseRegistrationInput = Parameters<
  typeof CourseRegistrationEntity.create
>[0];
export type UpdateCourseRegistration = (
  entity: CourseRegistrationEntity,
) => void;
export class CreateCourseRegistrationUseCase {
  constructor(private readonly repository: courseRegistrationRepository) {}
  async execute(input: CreateCourseRegistrationInput): Promise<void> {
    await this.repository.create(CourseRegistrationEntity.create(input));
  }
}
export class GetCourseRegistrationByIdUseCase {
  constructor(private readonly repository: courseRegistrationRepository) {}
  async execute(id: EntityId): Promise<CourseRegistrationEntity> {
    const key = normalizeEntityId(id, "CourseRegistration");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("CourseRegistration", id);
    return entity;
  }
}
export { GetCourseRegistrationByIdUseCase as GetCourseRegistrationUseCase };
export class GetAllCourseRegistrationsUseCase {
  constructor(private readonly repository: courseRegistrationRepository) {}
  async execute(): Promise<CourseRegistrationEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}
export { GetAllCourseRegistrationsUseCase as ListCourseRegistrationsUseCase };
export class UpdateCourseRegistrationUseCase {
  constructor(private readonly repository: courseRegistrationRepository) {}
  async execute(id: EntityId, update: UpdateCourseRegistration): Promise<void> {
    const key = normalizeEntityId(id, "CourseRegistration");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("CourseRegistration", id);
    update(entity);
    await this.repository.update(key);
  }
}
export class DeleteCourseRegistrationUseCase {
  constructor(private readonly repository: courseRegistrationRepository) {}
  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "CourseRegistration"));
  }
}
export * from "./course-registration.specialized.use-case.interface";
export { RegisterCourseUseCase } from "./register-course.usecase";
