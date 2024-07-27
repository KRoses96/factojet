import { AppDataSource } from "../src/data-source";
import { Project } from "../src/entity/Project";

export const addProject = async (projectName: string, startDate: Date, priority: number) => {
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Project)
    .values({
      name: projectName,
      start_date: startDate,
      priority: priority
    })
    .execute();
};

export const getProjects = async () => {
  return AppDataSource.getRepository(Project).find({
    relations: ["tasks", "tasks.skills"]})
};

export const deleteProject = async (name: string) => {
  await AppDataSource.createQueryBuilder()
    .delete()
    .from(Project)
    .where("name = :name", { name: name })
    .execute();
};

export const addDetailProject = async (projectName: string, detail: string) => {
  await AppDataSource.createQueryBuilder()
    .update(Project)
    .set({ detail: detail })
    .where("name = :name", { name: projectName })
    .execute();
};
