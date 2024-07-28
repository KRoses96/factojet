import { AppDataSource } from "../src/data-source";
import { Project } from "../src/entity/Project";

export const addProject = async (projectName: string, startDate: Date, priority: number,details: string) => {
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Project)
    .values({
      name: projectName,
      start_date: startDate,
      priority: priority,
      details: details
    })
    .execute();
};

export const getProjects = async () => {
  return AppDataSource.getRepository(Project).find({
    relations: ["tasks", "tasks.skills"]})
};

export const deleteProject = async (id: number) => {
  await AppDataSource.createQueryBuilder()
    .delete()
    .from(Project)
    .where("id = :id", { id: id })
    .execute();
};

export const editProject = async (projectId: number,projectName: string, start: Date, priority: number ,projectDetail: string) => {
  await AppDataSource.createQueryBuilder()
    .update(Project)
    .set({ details: projectDetail, name: projectName,start_date: start, priority: priority })
    .where("id = :id", { id: projectId })
    .execute();
};

export const getInfoProject = async(projectId: number) => {
  const project = await AppDataSource.getRepository(Project).findOne({where : {
    id: projectId
  }})
  return project
}