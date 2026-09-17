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
import { Class } from "./Class";
import { Quiz } from "./Quiz";

@Entity("class_quizzes")
@Unique(["class_id", "quiz_id"])
export class ClassQuiz {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "class_id", type: "int" })
  @Index()
  class_id!: number;

  @ManyToOne(() => Class, (cls) => cls.classQuizzes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "class_id" })
  class!: Class;

  @Column({ name: "quiz_id", type: "int" })
  @Index()
  quiz_id!: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.classQuizzes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "quiz_id" })
  quiz!: Quiz;

  @Column({ type: "timestamp", nullable: true })
  dueDate!: Date | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "assignedAt" })
  assignedAt!: Date;
}
