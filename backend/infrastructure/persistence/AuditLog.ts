import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("audit_logs")
export class AuditLog {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: string;

  @Column({ name: "userId", type: "int", nullable: true })
  userId!: number | null;

  // AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  @ManyToOne(() => User, (user) => user.auditLogs, { nullable: true })
  @JoinColumn({ name: "userId" })
  user!: User | null;

  @Column({ type: "varchar", length: 100, nullable: false })
  action!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  resource!: string | null;

  @Column({ name: "resourceId", type: "varchar", length: 100, nullable: true })
  resourceId!: string | null;

  @Column({ type: "varchar", length: 10, nullable: false })
  method!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  path!: string;

  @Column({ name: "statusCode", type: "int", nullable: false })
  statusCode!: number;

  @Column({ type: "varchar", length: 64, nullable: true })
  ip!: string | null;

  @Column({ type: "json", nullable: true })
  metadata!: Record<string, any> | null;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;
}
