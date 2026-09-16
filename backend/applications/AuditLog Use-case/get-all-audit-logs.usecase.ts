import { AuditLogEntity } from "../../domain/entities";
import type { auditLogRepository } from "../../domain/repositories/audit-log.repository.interface";

export class GetAllAuditLogsUseCase {
  constructor(private readonly repository: auditLogRepository) {}

  async execute(): Promise<AuditLogEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}

export { GetAllAuditLogsUseCase as ListAuditLogsUseCase };
