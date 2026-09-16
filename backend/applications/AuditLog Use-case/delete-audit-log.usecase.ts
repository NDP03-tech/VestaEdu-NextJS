import type { auditLogRepository } from "../../domain/repositories/audit-log.repository.interface";
import { normalizeEntityId, type EntityId } from "../use-case.helpers";

export class DeleteAuditLogUseCase {
  constructor(private readonly repository: auditLogRepository) {}

  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "AuditLog"));
  }
}
