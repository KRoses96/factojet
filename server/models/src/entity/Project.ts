import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from "typeorm";
import { Task } from "./Task";

@Entity()
@Unique(['name'])
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  start_date: Date;

  @Column({ nullable: true })
  details: string;

  @Column()
  priority: number

  @Column()
  imgUrl: string;

  @OneToMany(() => Task, (task) => task.project, {cascade:true, onDelete: 'CASCADE'})
  tasks: Task[];
}
