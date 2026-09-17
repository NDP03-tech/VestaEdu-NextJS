import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "userId", type: "int", nullable: false })
  userId!: number;

  // RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  @ManyToOne(() => User, (user) => user.refreshTokens, { nullable: false })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({
    name: "tokenHash",
    type: "varchar",
    length: 64,
    nullable: false,
    unique: true,
  })
  tokenHash!: string;

  @Column({ name: "expiresAt", type: "timestamp", nullable: false })
  expiresAt!: Date;

  @Column({ name: "revokedAt", type: "timestamp", nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
}
