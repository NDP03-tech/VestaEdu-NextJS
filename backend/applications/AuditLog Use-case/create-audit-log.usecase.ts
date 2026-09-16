import { AuditLogEntity } from "../../domain/entities";
import type { auditLogRepository } from "../../domain/repositories/audit-log.repository.interface";
import type { CreateAuditLogInput } from "./audit-log.use-case.interface";

export class CreateAuditLogUseCase {
  constructor(private readonly repository: auditLogRepository) {}

  async execute(input: CreateAuditLogInput): Promise<void> {
    await this.repository.create(AuditLogEntity.create(input));
  }
}
