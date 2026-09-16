import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Question } from "./Question.entity";
import { UserQuizResult } from "./UserQuizResult.entity";
import { AttemptCounter } from "./AttemptCounter.entity";
import { ClassQuiz } from "./ClassQuiz.entity";

export interface QuizUiSettings {
  oneQuestionPerPage: boolean;
  showQuestionNumbers: boolean;
  shuffle: string;
  timeLimit: number;
  maxAttempts: string | number;
  showFeedback: boolean;
  displayScore: boolean;
  specialChars: string;
  headerText: string;
  instructionText: string;
  quizCompleteMessage: string;
  showHeaderInput: boolean;
  showCompletionInput: boolean;
  showInstructionInput: boolean;
}

const DEFAULT_UI_SETTINGS: QuizUiSettings = {
  oneQuestionPerPage: false,
  showQuestionNumbers: true,
  shuffle: "none",
  timeLimit: 0,
  maxAttempts: "Unlimited",
  showFeedback: true,
  displayScore: true,
  specialChars: "",
  headerText: "",
  instructionText: "",
  quizCompleteMessage: "",
  showHeaderInput: false,
  showCompletionInput: false,
  showInstructionInput: false,
};

@Entity("quizzes")
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: true })
  title: string | null;

  @Column({ type: "varchar", nullable: true })
  category: string | null;

  @Column({
    name: "visibleTo",
    type: "varchar",
    nullable: false,
    default: "everyone",
  })
  visibleTo: string;

  @Column({ name: "uiSettings", type: "jsonb", nullable: true })
  uiSettings: QuizUiSettings | null = DEFAULT_UI_SETTINGS;

  // Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions' })
  @OneToMany(() => Question, (q) => q.quiz)
  questions: Question[];

  // Quiz.hasMany(UserQuizResult, { foreignKey: 'quiz_id', as: 'results' })
  @OneToMany(() => UserQuizResult, (r) => r.quiz)
  results: UserQuizResult[];

  // Quiz.hasMany(AttemptCounter, { foreignKey: 'quiz_id', as: 'attemptCounters' })
  @OneToMany(() => AttemptCounter, (c) => c.quiz)
  attemptCounters: AttemptCounter[];

  // thay cho Quiz.belongsToMany(Class, { through: 'class_quizzes', as: 'classes' })
  @OneToMany(() => ClassQuiz, (cq) => cq.quiz)
  classQuizzes: ClassQuiz[];

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;
}
