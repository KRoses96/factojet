import { Request, Response } from "express";
import { addTask, deleteTask, getTask, getTasks } from "../models/methods/TaskMethods";

export const insertTask = async (req: Request, res: Response) => {
  try {
    const projectName = req.body.projectName;
    const skills = req.body.skills;
    const timeHours = req.body.timeHours;
    const taskName = req.body.taskName;
    const required = req.body.required;
    await addTask(taskName, timeHours, projectName, skills, required, false);
    res.status(201).send(`${taskName} added!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const removeTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.body.taskId;
    await deleteTask(taskId);
    res.status(201).send(`${taskId} removed!`);
  } catch (error) {
    res.status(400).send(error);
  }
};


export const allTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await getTasks();
    res.status(200).send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const infoTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId
    const tasks = await getTask(parseInt(taskId));
    res.status(200).send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
};