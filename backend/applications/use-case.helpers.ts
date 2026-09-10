export type EntityId = string | number;

export function normalizeEntityId(id: EntityId, entityName: string): string {
  const normalizedId = String(id).trim();
  if (!normalizedId) throw new Error(`${entityName} id is required`);
  return normalizedId;
}

export function notFound(entityName: string, id: EntityId): Error {
  return new Error(`${entityName} ${String(id)} not found`);
}
