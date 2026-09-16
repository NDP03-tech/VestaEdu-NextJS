import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from "typeorm";
import { Class } from "./Class.entity";
import { User } from "./User.entity";

@Entity("class_students")
@Unique(["class_id", "user_id"])
export class ClassStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "class_id", type: "int" })
  @Index()
  class_id: number;

  @ManyToOne(() => Class, (cls) => cls.classStudents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "class_id" })
  class: Class;

  @Column({ name: "user_id", type: "int" })
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.classStudents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @CreateDateColumn({ name: "joinedAt" })
  joinedAt: Date;
}
