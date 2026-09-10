import { AuditLogEntity } from "../entities";

export interface auditLogRepository {
  delete(id: string): Promise<void>;
  create(log: AuditLogEntity): Promise<void>;
  getById(id: string): Promise<AuditLogEntity | null>;
  getAll(): Promise<AuditLogEntity[] | null>;
  update(id: string): Promise<void>;
}
