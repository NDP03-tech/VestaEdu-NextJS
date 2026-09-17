import { Repository } from "typeorm";
import { AuditLogEntity } from "../../domain/entities";
import { auditLogRepository } from "../../domain/repositories/audit-log.repository.interface";
import { AuditLog } from "../persistence/AuditLog";
import { AuditLogMapper } from "../mapper/audit-log.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";

export class AuditLogRepository
  extends TypeOrmCrudRepository<AuditLogEntity, AuditLog>
  implements auditLogRepository
{
  constructor(repository: Repository<AuditLog>) {
    super(repository, AuditLogMapper);
  }
}
