import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
  Unique,
} from "typeorm";
import { Skill } from "./Skill";

@Entity()
@Unique(['name'])
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[];
}
