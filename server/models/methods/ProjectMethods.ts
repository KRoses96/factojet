import { AppDataSource } from "../src/data-source";
import { Project } from "../src/entity/Project";

export const addProject = async (projectName: string, startDate: Date) => {
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Project)
    .values({
      name: projectName,
      start_date: startDate,
    })
    .execute();
};

export const getProjects = async () => {
  return AppDataSource.manager.find(Project);
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
