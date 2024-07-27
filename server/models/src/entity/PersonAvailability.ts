import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Person } from "./Person";

@Entity()
export class PersonAvaliability {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Person)
  @JoinColumn()
  person: Person;

  @Column({nullable: true})
  monday_start: number;

  @Column({nullable: true})
  monday_end: number;

  @Column({nullable: true})
  tuesday_start: number;

  @Column({nullable: true})
  tuesday_end: number ;

  @Column({nullable: true})
  wednesday_start: number ;

  @Column({nullable: true})
  wednesday_end: number;

  @Column({nullable: true})
  thursday_start: number;

  @Column({nullable: true})
  thursday_end: number;

  @Column({nullable: true})
  friday_start: number;

  @Column({nullable: true})
  friday_end: number;

  @Column({nullable: true})
  saturday_start: number;

  @Column({nullable: true})
  saturday_end: number;

  @Column({nullable: true})
  sunday_start: number;

  @Column({nullable: true})
  sunday_end: number;
}
