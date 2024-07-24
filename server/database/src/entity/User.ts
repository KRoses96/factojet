import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Person } from "./Person";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user: string;

  @Column({ nullable: false })
  pass: string;

  @OneToOne(() => Person)
  @JoinColumn()
  person_id: Person;
}
