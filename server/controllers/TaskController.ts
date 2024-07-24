import { Request, Response } from "express";
import { addTask, deleteTask } from "../models/methods/TaskMethods";

export const insertTask = async (req: Request, res: Response) => {
  try {
    const projectName = req.body.projectName;
    const skills = req.body.skills;
    const timeHours = req.body.timeHours;
    const taskName = req.body.taskName;
    await addTask(taskName, timeHours, projectName, skills);
    res.status(201).send(`${taskName} added!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const removeTask = async (req: Request, res: Response) => {
  try {
    const taskName = req.body.taskName;
    await deleteTask(taskName);
    res.status(201).send(`${taskName} removed!`);
  } catch (error) {
    res.status(400).send(error);
  }
};
