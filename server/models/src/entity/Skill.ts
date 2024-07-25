import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from "typeorm";

@Entity()
@Unique(['name'])
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

}
