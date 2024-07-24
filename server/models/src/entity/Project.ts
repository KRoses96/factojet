import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "./Task";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  start_date: Date;

  @Column({ nullable: true })
  details: string;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
