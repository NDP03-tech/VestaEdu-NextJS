import { AuditLogEntity } from "../../domain/entities";
import type { auditLogRepository } from "../../domain/repositories/audit-log.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class GetAuditLogByIdUseCase {
  constructor(private readonly repository: auditLogRepository) {}

  async execute(id: EntityId): Promise<AuditLogEntity> {
    const key = normalizeEntityId(id, "AuditLog");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("AuditLog", id);
    return entity;
  }
}

export { GetAuditLogByIdUseCase as GetAuditLogUseCase };
