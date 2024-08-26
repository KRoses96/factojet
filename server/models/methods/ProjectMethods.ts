import { AppDataSource } from "../src/data-source";
import { Project } from "../src/entity/Project";
import { Task } from "../src/entity/Task";


type ChangeProject = {
  details: string,
    name: string,
    start_date: Date,
    priority: number,
    imgUrl: string,
}

export const addProject = async (
  projectName: string,
  startDate: Date,
  priority: number,
  details: string,
  projectImage : string
) => {
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Project)
    .values({
      name: projectName,
      start_date: startDate,
      priority: priority,
      details: details,
      imgUrl: projectImage
    })
    .execute();
};

export const getProjects = async () => {
  return AppDataSource.getRepository(Project).find({
    relations: ["tasks", "tasks.skills"],
  });
};

export const deleteProject = async (id: number) => {
  await AppDataSource.createQueryBuilder()
    .delete()
    .from(Task)
    .where("projectId = :id", { id })
    .execute();
  await AppDataSource.createQueryBuilder()
    .delete()
    .from(Project)
    .where("id = :id", { id })
    .execute();
};

export const editProject = async (
  projectId: number,
  projectName: string,
  start: Date,
  priority: number,
  projectDetail: string,
  projectImage: string,
) => {
  const changes : ChangeProject = {
    details: projectDetail,
    name: projectName,
    start_date: start,
    priority: priority,
    imgUrl: projectImage
  }
  await AppDataSource.createQueryBuilder()
    .update(Project)
    .set(changes)
    .where("id = :id", { id: projectId })
    .execute();
  
};

export const getInfoProject = async (projectId: number) => {
  const project = await AppDataSource.getRepository(Project).findOne({
    where: {
      id: projectId,
    },
    relations: ["tasks", "tasks.required", "tasks.skills"],
  });
  return project;
};
