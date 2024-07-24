import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { Skill } from "./Skill";
@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[];
}
