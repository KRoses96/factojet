import type { Request, Response } from "express";
import {
	addProject,
	deleteProject,
	editProject,
	getInfoProject,
	getProjects,
} from "../models/methods/ProjectMethods";

export const insertProject = async (req: Request, res: Response) => {
	try {
		const {
			projectName,
			projectStart,
			projectPriority,
			projectDetail,
			projectImage,
		} = req.body;
		await addProject(
			projectName,
			projectStart,
			projectPriority,
			projectDetail,
			projectImage,
		);
		res.status(201).send(`${projectName} added!`);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const allProjects = async (req: Request, res: Response) => {
	try {
		const projects = await getProjects();
		res.status(200).send(projects);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const removeProject = async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId;
		await deleteProject(Number(projectId));
		res.status(201).send(`${projectId} removed!`);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const updateProject = async (req: Request, res: Response) => {
	try {
		const projectStart = new Date(req.body.projectStart);
    const {projectId, projectName, projectDetail, projectPriority, projectImage} = req.body
		editProject(
			projectId,
			projectName,
			projectStart,
			projectPriority,
			projectDetail,
			projectImage,
		);
		res.status(202).send(`${projectName} updated!`);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const findProject = async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId;
		const project = await getInfoProject(Number(projectId));
		res.status(200).send(project);
	} catch (error) {
		res.status(500).send(error);
	}
};
