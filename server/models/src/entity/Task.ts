import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,ManyToMany, JoinTable } from "typeorm"
import { Project } from "./Project"
import { Skill } from "./Skill"


@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column ({nullable: false})
    time: number

    @ManyToOne(() => Project, (project) => project.tasks)
    project : Project

    @ManyToMany(() => Skill)
    @JoinTable()
    skills: Skill[]
}