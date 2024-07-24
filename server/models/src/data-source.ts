import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Skill } from "./entity/Skill";
import { Person } from "./entity/Person";
import { Project } from "./entity/Project";
import { Task } from "./entity/Task";
import { PersonAvaliability } from "./entity/PersonAvaliability";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "",
  database: "factorito",
  synchronize: true,
  logging: false,
  entities: [Person, Project, Skill, Task, User, PersonAvaliability],
  migrations: [],
  subscribers: [],
});
