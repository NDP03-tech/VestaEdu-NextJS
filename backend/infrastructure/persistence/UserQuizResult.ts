import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./User";
import { Quiz } from "./Quiz";

@Entity("user_quiz_results")
@Index(["user_id", "quiz_id", "score"])
export class UserQuizResult {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "user_id", type: "int", nullable: false })
  user_id!: number;

  // UserQuizResult.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
  @ManyToOne(() => User, (user) => user.quizResults, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "quiz_id", type: "int", nullable: false })
  quiz_id!: number;

  // UserQuizResult.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' })
  @ManyToOne(() => Quiz, (quiz) => quiz.results, { nullable: false })
  @JoinColumn({ name: "quiz_id" })
  quiz!: Quiz;

  @Column({ type: "jsonb", nullable: true, default: () => "'[]'" })
  answers!: any[] | null;

  @Column({ type: "int", default: 0 })
  score!: number;

  @Column({ type: "boolean", default: false })
  passed!: boolean;

  @Column({
    name: "startedAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  startedAt!: Date;

  @Column({ name: "submittedAt", type: "timestamp", nullable: true })
  submittedAt!: Date | null;

  @Column({ name: "attemptNumber", type: "int", default: 1 })
  attemptNumber!: number;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
}
