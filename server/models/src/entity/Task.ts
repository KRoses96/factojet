import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Project } from "./Project";
import { Skill } from "./Skill";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  time: number;

  @Column ()
  complete: false;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @ManyToMany(() => Task, (task) => task.required)
  @JoinTable()
  required: Task[];

  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[];
}
