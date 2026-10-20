import { Request, Response, NextFunction } from "express";
import { QueueDispatcher } from "../queues/queue.dispatcher";

export const auditLogMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.on("finish", () => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return;
    const user = (req as any).user;
    const rawId = req.params?.id || req.params?.userId;
    const resourceId = Array.isArray(rawId) ? rawId[0] : rawId ?? null;

    QueueDispatcher.dispatchAuditLog({
      userId: user ? user.id : null,
      action: `${req.method} ${req.route ? req.route.path : req.path}`,
      resource: req.baseUrl || null,
      resourceId,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      ip: req.ip,
      metadata: { query: req.query },
    });
  });
  next();
};
