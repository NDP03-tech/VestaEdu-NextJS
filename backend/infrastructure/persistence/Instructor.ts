import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum InstructorStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity("instructors")
export class Instructor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  designation!: string;

  @Column({ type: "text", nullable: true })
  bio!: string | null;

  @Column({ type: "varchar", length: 255, default: "default-instructor.jpg" })
  image!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  facebook!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  twitter!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  linkedin!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  email!: string | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone!: string | null;

  @Column({
    type: "enum",
    enum: InstructorStatus,
    default: InstructorStatus.ACTIVE,
  })
  status!: InstructorStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
