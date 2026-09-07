// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
import {
  requireNonEmpty,
  validateMethod,
  validateStatusCode,
} from "../../utils/validation";

interface AuditLogProps {
  id: number;
  userId: number | null;
  action: string;
  resource: string | null;
  resourceId: string | null;
  method: string;
  path: string;
  statusCode: number;
  ip: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

interface CreateAuditLogProps {
  userId?: number | null;
  action: string;
  resource?: string | null;
  resourceId?: string | null;
  method: string;
  path: string;
  statusCode: number;
  ip?: string | null;
  metadata?: Record<string, unknown> | null;
}

export class AuditLogEntity {
  private constructor(
    private readonly _id: number,
    private _userId: number | null,
    private _action: string,
    private _resource: string | null,
    private _resourceId: string | null,
    private _method: string,
    private _path: string,
    private _statusCode: number,
    private _ip: string | null,
    private _metadata: Record<string, unknown> | null,
    private readonly _createdAt: Date
  ) {}

  static create(props: CreateAuditLogProps): AuditLogEntity {
    return new AuditLogEntity(0,
      props.userId ?? null,
      requireNonEmpty(props.action, "action"),
      props.resource?.trim() || null,
      props.resourceId?.trim() || null,
      validateMethod(props.method),
      requireNonEmpty(props.path, "path"),
      validateStatusCode(props.statusCode),
      props.ip?.trim() || null,
      props.metadata ?? null,
      new Date()
    );
  }

  static reconstitute(props: AuditLogProps): AuditLogEntity {
    return new AuditLogEntity(
      props.id,
      props.userId,
      props.action,
      props.resource,
      props.resourceId,
      props.method,
      props.path,
      props.statusCode,
      props.ip,
      props.metadata,
      props.createdAt
    );
  }

  // ===== Getters =====
  get id(): number {
    return this._id;
  }
  get userId(): number | null {
    return this._userId;
  }
  get action(): string {
    return this._action;
  }
  get resource(): string | null {
    return this._resource;
  }
  get resourceId(): string | null {
    return this._resourceId;
  }
  get method(): string {
    return this._method;
  }
  get path(): string {
    return this._path;
  }
  get statusCode(): number {
    return this._statusCode;
  }
  get ip(): string | null {
    return this._ip;
  }
  get metadata(): Record<string, unknown> | null {
    if (this._metadata === null) return null;
    return { ...this._metadata };
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  isSuccess(): boolean {
    return this._statusCode >= 200 && this._statusCode < 400;
  }

  isError(): boolean {
    return this._statusCode >= 400;
  }
}
