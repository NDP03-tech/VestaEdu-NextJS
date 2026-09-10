export class AuditLogNotFoundException extends Error {
  constructor(id: string | number) {
    super(`AuditLog ${String(id)} not found`);
    this.name = "AuditLogNotFoundException";
  }
}
