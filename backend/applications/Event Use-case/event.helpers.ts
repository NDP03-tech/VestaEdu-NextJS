import type { EventId, UpdateEventInput } from "./event.use-case.interface";
export function normalizeEventId(id: EventId): string {
  const value = String(id).trim();
  if (!value) throw new Error("Event id is required");
  return value;
}
export function hasUpdateFields(input: UpdateEventInput): boolean {
  return Object.values(input).some((value) => value !== undefined);
}
