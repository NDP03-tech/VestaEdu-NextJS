import { AuditLogEntity } from "../../domain/entities";
import type { auditLogRepository } from "../../domain/repositories/audit-log.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";
export type CreateAuditLogInput = Parameters<typeof AuditLogEntity.create>[0];
export class CreateAuditLogUseCase {
  constructor(private readonly repository: auditLogRepository) {}
  async execute(input: CreateAuditLogInput): Promise<void> {
    await this.repository.create(AuditLogEntity.create(input));
  }
}
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
export class GetAllAuditLogsUseCase {
  constructor(private readonly repository: auditLogRepository) {}
  async execute(): Promise<AuditLogEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}
export { GetAllAuditLogsUseCase as ListAuditLogsUseCase };
export class DeleteAuditLogUseCase {
  constructor(private readonly repository: auditLogRepository) {}
  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "AuditLog"));
  }
}
