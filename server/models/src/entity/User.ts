import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { Person } from "./Person";

@Entity()
@Unique(["user"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user: string;

  @Column({ nullable: false })
  pass: string;

  @Column({ nullable: false })
  admin: boolean;

  @OneToOne(() => Person)
  @JoinColumn()
  person_id: Person;
}
