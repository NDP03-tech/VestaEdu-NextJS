import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { CourseRegistration } from "./CourseRegistration";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false })
  image!: string;

  @Column({ name: "bannerImg", type: "varchar", nullable: true })
  bannerImg!: string | null;

  @Column({ type: "varchar", nullable: false })
  name!: string;

  @Column({ type: "varchar", nullable: false })
  author!: string;

  @Column({ name: "authorImg", type: "varchar", nullable: true })
  authorImg!: string | null;

  @Column({ type: "varchar", nullable: false })
  lesson!: string;

  @Column({ type: "varchar", nullable: false })
  price!: string;

  @Column({ type: "varchar", nullable: false })
  duration!: string;

  @Column({ type: "varchar", nullable: false })
  type!: string;

  @Column({ type: "varchar", nullable: false })
  language!: string;

  @Column({ type: "text", nullable: false })
  content!: string;

  @Column({ type: "varchar", nullable: false })
  title!: string;

  @Column({ type: "text", nullable: false })
  dis!: string;

  @Column({ type: "jsonb", nullable: false, default: () => "'[]'" })
  schedule!: any[];

  // Course.hasMany(CourseRegistration, { foreignKey: 'courseId', as: 'registrations' })
  @OneToMany(() => CourseRegistration, (reg) => reg.course)
  registrations: CourseRegistration[] = [];

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
}
