import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Person } from "./Person";

@Entity()
export class PeopleAvaliability {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Person)
  @JoinColumn()
  person: Person;

  @Column()
  monday_start: Date;

  @Column()
  monday_end: Date;

  @Column()
  tuesday_start: Date;

  @Column()
  tuesday_end: Date;

  @Column()
  wednesday_start: Date;

  @Column()
  wednesday_end: Date;

  @Column()
  thursday_start: Date;

  @Column()
  thursday_end: Date;

  @Column()
  friday_start: Date;

  @Column()
  friday_end: Date;

  @Column()
  saturday_start: Date;

  @Column()
  saturday_end: Date;

  @Column()
  sunday_start: Date;

  @Column()
  sunday_end: Date;
}
