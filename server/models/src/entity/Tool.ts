import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Unique } from "typeorm";
import { Skill } from "./Skill";
@Entity()
@Unique(['name'])
export class Tool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  quantity: number;

  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[];
}
