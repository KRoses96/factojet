import type { Request, Response } from "express";
import {
	addTask,
	deleteTask,
	getTask,
	getTasks,
	updateTask,
} from "../models/methods/TaskMethods";

export const insertTask = async (req: Request, res: Response) => {
	try {
		const { projectId, skills, timeHours, taskName, required } = req.body;
		await addTask(taskName, timeHours, projectId, skills, required, false);
		res.status(201).send(`${taskName} added!`);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const removeTask = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.body;
		await deleteTask(taskId);
		res.status(201).send(`${taskId} removed!`);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const updateInfoTask = async (req: Request, res: Response) => {
	try {
		const { projectId, taskId, taskName, time, skills, required } = req.body;
		await updateTask(projectId, taskId, taskName, time, skills, required);
		res.status(201).send(`${taskId} updated!`);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const allTasks = async (req: Request, res: Response) => {
	try {
		const tasks = await getTasks();
		res.status(200).send(tasks);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const infoTask = async (req: Request, res: Response) => {
	try {
		const taskId = req.params.taskId;
		const tasks = await getTask(Number(taskId));
		res.status(200).send(tasks);
	} catch (error) {
		res.status(500).send(error);
	}
};
