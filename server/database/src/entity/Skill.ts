import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"


@Entity()
export class Skill {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    name: string

}