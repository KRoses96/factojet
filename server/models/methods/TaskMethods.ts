import { AppDataSource } from "../src/data-source";
import { Project } from "../src/entity/Project";
import { Task } from "../src/entity/Task";
import { Skill } from "../src/entity/Skill";

export const addTask = async (
  taskName: string,
  timeHours: number,
  project: string,
  skills: string
) => {
  const projectId = await AppDataSource.manager
    .findOneBy(Project, {
      name: project,
    })
    .then((projectFound) => (projectFound ? projectFound.id : null));

  console.log(skills);

  if (projectId) {
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Task)
      .values({
        name: taskName,
        time: timeHours,
        project: { id: projectId },
      })
      .execute();

    const task = await AppDataSource.manager.findOneBy(Task, {
      name: taskName,
    });

    const skillArr = skills.split(",");
    for (let skill of skillArr) {
      console.log(skill);
      const skillId = await AppDataSource.manager
        .findOneBy(Skill, {
          name: skill,
        })
        .then((skillFound) => (skillFound ? skillFound.id : null));

      await AppDataSource.createQueryBuilder()
        .relation(Task, "skills")
        .of(task)
        .add(skillId);
    }
  }
};

export const deleteTask = async (name: string) => {
  await AppDataSource.createQueryBuilder()
    .delete()
    .from(Task)
    .where("name = :name", { name: name })
    .execute();
};
