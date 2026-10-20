/**
 * BullMQ Worker - Background job processor
 * Xử lý các job async: gửi email, audit log, cleanup, notifications...
 */
require("dotenv").config();

const { Worker, Queue } = require("bullmq");
const { redis } = require("../config/redis");
const nodemailer = require("nodemailer");
const { AuditLog } = require("../infrastructure/persistence/AuditLog");
const { DataSourceConfig } = require("../config/data-source");

const emailQueue = new Queue("email", { connection: redis });
const auditQueue = new Queue("audit", { connection: redis });
const cleanupQueue = new Queue("cleanup", { connection: redis });

const createEmailTransporter = () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === "465",
      auth: { user: process.env.ADMIN_EMAIL, pass: process.env.ADMIN_EMAIL_PASSWORD },
    });
  }
  if (process.env.RESEND_API_KEY) {
    return {
      sendMail: async ({ to, subject, html, text }) => {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: process.env.ADMIN_EMAIL || "noreply@vestaedu.local", to, subject, html, text }),
        });
        if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);
        return res.json();
      },
    };
  }
  console.warn("⚠️ No email transport configured");
  return { sendMail: async () => ({ messageId: "mock" }) };
};

const transporter = createEmailTransporter();
// =====================================================
// Email Worker
// =====================================================
const emailWorker = new Worker(
  "email",
  async (job) => {
    const { to, subject, html, text, template, data } = job.data;
    console.log(`📧 Processing email job ${job.id} to ${to}`);
    try {
      let finalHtml = html, finalText = text;
      if (template && data) {
        finalHtml = html.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || "");
        finalText = text?.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || "");
      }
      await transporter.sendMail({ to, subject, html: finalHtml, text: finalText });
      console.log(`✅ Email sent to ${to}`);
      return { success: true, to };
    } catch (error) {
      console.error(`❌ Email failed for ${to}:`, error.message);
      throw error;
    }
  },
  { connection: redis, concurrency: 5 }
);

emailWorker.on("completed", (job) => console.log(`📧 Email job ${job.id} completed`));
emailWorker.on("failed", (job, err) => console.error(`📧 Email job ${job?.id} failed:`, err.message));

// =====================================================
// Audit Log Worker
// =====================================================
const auditWorker = new Worker(
  "audit",
  async (job) => {
    const { userId, action, resource, resourceId, method, path, statusCode, ip, metadata } = job.data;
    console.log(`📝 Processing audit log ${job.id}: ${action} on ${resource}`);
    try {
      if (!DataSourceConfig.isInitialized) await DataSourceConfig.initialize();
      const repo = DataSourceConfig.getRepository(AuditLog);
      await repo.save({ userId: userId || null, action, resource: resource || null, resourceId: resourceId || null, method, path, statusCode, ip: ip || null, metadata: metadata || null });
      console.log(`✅ Audit log saved`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Audit log failed:`, error.message);
      throw error;
    }
  },
  { connection: redis, concurrency: 10 }
);

auditWorker.on("completed", (job) => console.log(`📝 Audit job ${job.id} completed`));
auditWorker.on("failed", (job, err) => console.error(`📝 Audit job ${job?.id} failed:`, err.message));

// =====================================================
// Cleanup Worker
// =====================================================
const cleanupWorker = new Worker(
  "cleanup",
  async (job) => {
    const { type } = job.data;
    console.log(`🧹 Processing cleanup job ${job.id}: ${type}`);
    try {
      if (!DataSourceConfig.isInitialized) await DataSourceConfig.initialize();
      let result = { deleted: 0 };
      switch (type) {
        case "expired_tokens": {
          const { RefreshToken } = require("../infrastructure/persistence/RefreshToken");
          const repo = DataSourceConfig.getRepository(RefreshToken);
          const res = await repo.createQueryBuilder().delete().where("expiresAt < NOW()").orWhere("revokedAt IS NOT NULL").execute();
          result.deleted = res.affected || 0;
          break;
        }
        case "old_audit_logs": {
          const repo = DataSourceConfig.getRepository(AuditLog);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          const res = await repo.createQueryBuilder().delete().where("createdAt < :date", { date: thirtyDaysAgo }).execute();
          result.deleted = res.affected || 0;
          break;
        }
        default:
          console.warn(`⚠️ Unknown cleanup type: ${type}`);
      }
      console.log(`✅ Cleanup ${type}: deleted ${result.deleted} records`);
      return result;
    } catch (error) {
      console.error(`❌ Cleanup failed:`, error.message);
      throw error;
    }
  },
  { connection: redis, concurrency: 1 }
);

cleanupWorker.on("completed", (job) => console.log(`🧹 Cleanup job ${job.id} completed`));
cleanupWorker.on("failed", (job, err) => console.error(`🧹 Cleanup job ${job?.id} failed:`, err.message));

// =====================================================
// Graceful shutdown
// =====================================================
const shutdown = async () => {
  console.log("🛑 Shutting down workers...");
  await Promise.all([emailWorker.close(), auditWorker.close(), cleanupWorker.close()]);
  await redis.quit();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

console.log("🚀 BullMQ Workers started:");
console.log("   - email (concurrency: 5)");
console.log("   - audit (concurrency: 10)");
console.log("   - cleanup (concurrency: 1)");

setInterval(() => {}, 1000 * 60 * 60);