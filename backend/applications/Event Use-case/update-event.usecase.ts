import type { eventRepository } from "../../domain/repositories/event.repository.interface";
import type { UpdateEventInput } from "./event.use-case.interface";
import {
  asInputValidationError,
  EventInputValidationError,
  EventNotFoundException,
} from "./event.exceptions";
import { hasUpdateFields, normalizeEventId } from "./event.helpers";
export class UpdateEventUseCase {
  constructor(private readonly eventRepository: eventRepository) {}
  async execute(id: string | number, input: UpdateEventInput): Promise<void> {
    const key = normalizeEventId(id);
    if (!input || typeof input !== "object" || !hasUpdateFields(input))
      throw new EventInputValidationError(
        "At least one event field must be provided",
      );
    const entity = await this.eventRepository.getById(key);
    if (!entity) throw new EventNotFoundException(key);
    try {
      const { image, bannerImg, ...basicInfo } = input;
      entity.updateBasicInfo(basicInfo);
      if (image !== undefined) entity.setImage(image);
      if (bannerImg !== undefined) entity.setBannerImg(bannerImg);
    } catch (error) {
      throw asInputValidationError(error);
    }
    await this.eventRepository.update(key);
  }
}
