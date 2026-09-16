import type { AuditLogEntity } from "../../domain/entities";

export type CreateAuditLogInput = Parameters<typeof AuditLogEntity.create>[0];
