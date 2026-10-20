import { Queue } from "bullmq";
import { redis } from "../config/redis";

export interface EmailJobData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  data?: Record<string, any>;
}

export interface AuditJobData {
  userId?: number | null;
  action: string;
  resource?: string | null;
  resourceId?: string | number | null;
  method: string;
  path: string;
  statusCode: number;
  ip?: string | null;
  metadata?: any;
}

let emailQueue: Queue | null = null;
let auditQueue: Queue | null = null;

try {
  emailQueue = new Queue("email", { connection: redis });
  auditQueue = new Queue("audit", { connection: redis });
} catch (error) {
  console.warn("⚠️ Redis/BullMQ connection initialization deferred:", (error as Error).message);
}

export const QueueDispatcher = {
  async dispatchEmail(data: EmailJobData): Promise<void> {
    try {
      if (emailQueue) {
        await emailQueue.add("send-email", data, {
          attempts: 3,
          backoff: { type: "exponential", delay: 2000 },
        });
      }
    } catch (err) {
      console.error("Failed to enqueue email job:", err);
    }
  },

  async dispatchAuditLog(data: AuditJobData): Promise<void> {
    try {
      if (auditQueue) {
        await auditQueue.add("save-audit", data, {
          removeOnComplete: true,
          attempts: 2,
        });
      }
    } catch (err) {
      console.error("Failed to enqueue audit job:", err);
    }
  },
};

