import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { User } from "./User.entity";
import { Quiz } from "./Quiz.entity";

@Entity("attempt_counters")
@Unique(["user_id", "quiz_id"])
export class AttemptCounter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id", type: "int", nullable: false })
  user_id: number;

  // User.hasMany(AttemptCounter) — inverse: AttemptCounter.belongsTo(User)
  @ManyToOne(() => User, (user) => user.attemptCounters, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "quiz_id", type: "int", nullable: false })
  quiz_id: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.attemptCounters, { nullable: false })
  @JoinColumn({ name: "quiz_id" })
  quiz: Quiz;

  @Column({ type: "int", default: 0 })
  count: number;

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;
}
