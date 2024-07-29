import { AppDataSource } from "../src/data-source";
import { Project } from "../src/entity/Project";
import { Task } from "../src/entity/Task";
import { Skill } from "../src/entity/Skill";

export const addTask = async (
  taskName: string,
  timeHours: number,
  projectId: number,
  skills: string[],
  required: number[],
  completed: boolean
) => {
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Task)
    .values({
      name: taskName,
      time: timeHours,
      project: { id: projectId },
      complete: false,
    })
    .execute();

  const task = await AppDataSource.manager.findOneBy(Task, {
    name: taskName,
  });

  for (let skill of skills) {
    const skillId = await AppDataSource.manager
      .findOneBy(Skill, {
        name: skill,
      })
      .then((skillFound) => (skillFound ? skillFound.id : null));
    if (skillId) {
      await AppDataSource.createQueryBuilder()
        .relation(Task, "skills")
        .of(task)
        .add(skillId);
    }
  }

  if (required) {
    for (let taskToComplete of required) {
      const taskToCompleteId = await AppDataSource.manager
        .findOneBy(Task, {
          id: taskToComplete,
        })
        .then((taskFound) => (taskFound ? taskFound.id : null));

      await AppDataSource.createQueryBuilder()
        .relation(Task, "required")
        .of(task)
        .add(taskToCompleteId);
    }
  }
};

export const deleteTask = async (id: number) => {
  await AppDataSource.createQueryBuilder()
    .delete()
    .from(Task)
    .where("id = :id", { id: id })
    .execute();
};

export const updateTask = async (
  projectId: number,
  taskId: number,
  taskName: string,
  time: number,
  skills: string[],
  required: number[]
) => {
  await AppDataSource.createQueryBuilder()
    .update(Task)
    .set({
      name: taskName,
      time: time,
      project: { id: projectId }
    })
    .where("id = :id", { id: taskId })
    .execute();

  const task = await AppDataSource.manager.findOne(Task, {
    where: { id: taskId },
    relations: ["skills", "required"]
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await AppDataSource.createQueryBuilder()
    .relation(Task, "skills")
    .of(task)
    .remove(task.skills);

  // Add new skills
  for (let skillName of skills) {
    const skill = await AppDataSource.manager.findOne(Skill, {
      where: { name: skillName }
    });

    if (skill) {
      await AppDataSource.createQueryBuilder()
        .relation(Task, "skills")
        .of(task)
        .add(skill.id);
    }
  }

  await AppDataSource.createQueryBuilder()
    .relation(Task, "required")
    .of(task)
    .remove(task.required);

  for (let requiredTaskId of required) {
    await AppDataSource.createQueryBuilder()
      .relation(Task, "required")
      .of(task)
      .add(requiredTaskId);
  }
};

export const getTasks = async () => {
  return AppDataSource.getRepository(Task).find({
    relations: { skills: true },
  });
};

export const getTask = async (taskId: number) => {
  return AppDataSource.getRepository(Task).findOne({
    where: {
      id: taskId,
    },
    relations: ["required", "skills"],
  });
};
