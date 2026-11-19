import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { ClassStudent } from "./classStudents";
import { ClassQuiz } from "./ClassQuiz";

@Entity("classes")
export class Class {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "teacher_id", type: "int", nullable: true })
  teacher_id!: number | null;

  // Class.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' })
  @ManyToOne(() => User, (user) => user.taughtClasses, { nullable: true })
  @JoinColumn({ name: "teacher_id" })
  teacher!: User | null;

  // thay cho Class.belongsToMany(User, { through: 'class_students', as: 'students' })
  @OneToMany(() => ClassStudent, (cs) => cs.class)
  classStudents!: ClassStudent[];

  // thay cho Class.belongsToMany(Quiz, { through: 'class_quizzes', as: 'quizzes' })
  @OneToMany(() => ClassQuiz, (cq) => cq.class)
  classQuizzes!: ClassQuiz[];

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
}
