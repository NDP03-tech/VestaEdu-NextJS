import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Course } from "./Course";

@Entity("course_registrations")
export class CourseRegistration {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false })
  name!: string;

  @Column({ type: "varchar", nullable: false })
  email!: string;

  @Column({ type: "varchar", nullable: false })
  phone!: string;

  @Column({ name: "courseId", type: "int", nullable: false })
  courseId!: number;

  // CourseRegistration.belongsTo(Course, { foreignKey: 'courseId', as: 'course' })
  @ManyToOne(() => Course, (course) => course.registrations, {
    nullable: false,
  })
  @JoinColumn({ name: "courseId" })
  course!: Course;

  @Column({ name: "courseTitle", type: "varchar", nullable: false })
  courseTitle!: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
}
