import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { EventRegistration } from "./EventRegistration";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false })
  image!: string;

  @Column({ name: "bannerImg", type: "varchar", nullable: false })
  bannerImg!: string;

  @Column({ type: "varchar", nullable: false })
  date!: string;

  @Column({ name: "startTime", type: "varchar", nullable: false })
  startTime!: string;

  @Column({ type: "varchar", nullable: false })
  category!: string;

  @Column({ type: "varchar", nullable: false })
  title!: string;

  @Column({ type: "varchar", nullable: false })
  location!: string;

  @Column({ type: "varchar", nullable: false })
  cost!: string;

  @Column({ type: "varchar", nullable: false })
  host!: string;

  @Column({ type: "text", nullable: false })
  content!: string;

  @Column({ type: "varchar", nullable: false })
  phone!: string;

  // Event.hasMany(EventRegistration, { foreignKey: 'eventId', as: 'registrations' })
  @OneToMany(() => EventRegistration, (reg) => reg.event)
  registrations: EventRegistration[] = [];

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
}
