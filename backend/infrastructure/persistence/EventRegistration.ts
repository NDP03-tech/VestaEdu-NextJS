import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Event } from './Event';

@Entity('event_registrations')
export class EventRegistration {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'varchar', nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  phone!: string;

  @Column({ name: 'eventId', type: 'int', nullable: false })
  eventId!: number;

  @ManyToOne(() => Event, (event) => event.registrations, { nullable: false })
  @JoinColumn({ name: 'eventId' })
  event!: Event;

  @Column({ name: 'eventTitle', type: 'varchar', nullable: false })
  eventTitle!: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt!: Date;
}