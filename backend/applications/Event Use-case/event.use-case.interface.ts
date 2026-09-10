import type { EventEntity } from "../../domain/entities";
export type EventId = string | number;
export type CreateEventInput = Parameters<typeof EventEntity.create>[0];
export type UpdateEventInput = Partial<
  Omit<CreateEventInput, "image" | "bannerImg">
> & { image?: string; bannerImg?: string };
