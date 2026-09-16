import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("blogs")
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false })
  title: string;

  @Column({ type: "varchar", nullable: false })
  image: string;

  @Column({ name: "bannerImg", type: "varchar", nullable: false })
  bannerImg: string;

  @Column({ type: "varchar", nullable: false })
  author: string;

  @Column({ name: "authorImg", type: "varchar", nullable: false })
  authorImg: string;

  @Column({ type: "text", nullable: false })
  content: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;
}
