import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Quiz } from "./Quiz.entity";

export enum QuestionType {
  BLANK_BOXES = "blank-boxes",
  GENERATED_DROPDOWNS = "generated-dropdowns",
  DRAG_DROP_MATCHING = "drag-drop-matching",
  FIND_HIGHLIGHT = "find-highlight",
  MULTIPLE_CHOICE = "multiple-choice",
  CHECKBOXES = "checkboxes",
  ESSAY = "essay",
  DESCRIPTION = "description",
  READING = "reading",
  SPEAKING = "speaking",
}

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "quiz_id", type: "int", nullable: false })
  quiz_id: number;

  // Question.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' })
  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { nullable: false })
  @JoinColumn({ name: "quiz_id" })
  quiz: Quiz;

  @Column({ name: "question_text", type: "text", nullable: false })
  question_text: string;

  @Column({ name: "readingContent", type: "text", nullable: true })
  readingContent: string | null;

  @Column({ type: "int", default: 0 })
  points: number;

  @Column({ type: "text", nullable: true })
  explanation: string | null;

  @Column({
    name: "question_type",
    type: "enum",
    enum: QuestionType,
    nullable: false,
  })
  question_type: QuestionType;

  @Column({ type: "jsonb", nullable: true, default: () => "'[]'" })
  gaps: any[] | null;

  @Column({ type: "jsonb", nullable: true, default: () => "'[]'" })
  dropdowns: any[] | null;

  @Column({
    name: "hintWords",
    type: "jsonb",
    nullable: true,
    default: () => "'[]'",
  })
  hintWords: any[] | null;

  @Column({ type: "jsonb", nullable: true, default: () => "'[]'" })
  options: any[] | null;

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;
}
