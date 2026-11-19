import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Class } from "./Class";
import { ClassStudent } from "./classStudents";
import { UserQuizResult } from "./UserQuizResult";
import { AttemptCounter } from "./AttemptCounter";
import { RefreshToken } from "./RefreshToken";
import { AuditLog } from "./AuditLog";

export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false, unique: true })
  email!: string;

  @Column({ type: "varchar", nullable: false })
  password!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.STUDENT })
  role!: UserRole;

  @Column({ name: "firstName", type: "varchar", nullable: true })
  firstName!: string | null;

  @Column({ name: "lastName", type: "varchar", nullable: true })
  lastName!: string | null;

  @Column({ name: "studentPhone", type: "varchar", nullable: true })
  studentPhone!: string | null;

  @Column({ name: "guardianPhone", type: "varchar", nullable: true })
  guardianPhone!: string | null;

  @Column({ name: "studentEmail", type: "varchar", nullable: true })
  studentEmail!: string | null;

  @Column({ name: "guardianEmail", type: "varchar", nullable: true })
  guardianEmail!: string | null;

  @Column({ type: "text", nullable: true })
  address!: string | null;

  // User.hasMany(Class, { foreignKey: 'teacher_id', as: 'taughtClasses' })
  @OneToMany(() => Class, (cls) => cls.teacher)
  taughtClasses!: Class[];

  // thay cho User.belongsToMany(Class, { through: 'class_students', as: 'classes' })
  @OneToMany(() => ClassStudent, (cs) => cs.user)
  classStudents!: ClassStudent[];

  // User.hasMany(UserQuizResult, { foreignKey: 'user_id', as: 'quizResults' })
  @OneToMany(() => UserQuizResult, (result) => result.user)
  quizResults!: UserQuizResult[];

  // User.hasMany(AttemptCounter, { foreignKey: 'user_id', as: 'attemptCounters' })
  @OneToMany(() => AttemptCounter, (counter) => counter.user)
  attemptCounters!: AttemptCounter[];

  // User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' })
  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens!: RefreshToken[];

  // User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' })
  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs!: AuditLog[];

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
