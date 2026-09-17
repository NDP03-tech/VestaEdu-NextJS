import { AuditLogEntity } from "../../domain/entities";
import { AuditLog } from "../persistence/AuditLog";

export class AuditLogMapper {
  static toDomain(orm: AuditLog): AuditLogEntity {
    return AuditLogEntity.reconstitute({
      id: Number(orm.id),
      userId: orm.userId,
      action: orm.action,
      resource: orm.resource,
      resourceId: orm.resourceId,
      method: orm.method,
      path: orm.path,
      statusCode: orm.statusCode,
      ip: orm.ip,
      metadata: orm.metadata,
      createdAt: orm.createdAt,
    });
  }

  static toPersistence(log: AuditLogEntity): AuditLog {
    const orm = new AuditLog();
    orm.id = String(log.id);
    orm.userId = log.userId;
    orm.action = log.action;
    orm.resource = log.resource;
    orm.resourceId = log.resourceId;
    orm.method = log.method;
    orm.path = log.path;
    orm.statusCode = log.statusCode;
    orm.ip = log.ip;
    orm.metadata = log.metadata;
    orm.createdAt = log.createdAt;
    return orm;
  }
}
