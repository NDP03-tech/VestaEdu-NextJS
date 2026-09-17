import { AuditLogEntity } from "../entities";

export interface auditLogRepository {
  delete(id: string | number): Promise<void>;
  create(log: AuditLogEntity): Promise<void>;
  getById(id: string | number): Promise<AuditLogEntity | null>;
  getAll(): Promise<AuditLogEntity[] | null>;
  update(id: string | number, log: AuditLogEntity): Promise<void>;
}
