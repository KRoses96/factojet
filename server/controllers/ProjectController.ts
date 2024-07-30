import { Request, Response } from "express";
import {
  addProject,
  deleteProject,
  editProject,
  getInfoProject,
  getProjects,
} from "../models/methods/ProjectMethods";

export const insertProject = async (req: Request, res: Response) => {
  try {
    const projectName = req.body.projectName;
    const projectStart = req.body.projectStart;
    const projectPriority = req.body.projectPriority
    const projectDetail = req.body.projectDetail
    const projectImage = req.body.projectImage
    await addProject(projectName, projectStart, projectPriority,projectDetail,projectImage);
    res.status(201).send(`${projectName} added!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const allProjects = async (req: Request, res: Response) => {
  try {
    const projects = await getProjects();
    res.status(200).send(projects);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const removeProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId
    await deleteProject(parseInt(projectId));
    res.status(201).send(`${projectId} removed!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.body.projectId
    const projectName = req.body.projectName;
    const projectDetail = req.body.projectDetail;
    const projectPriority = req.body.projectPriority
    const projectStart = new Date(req.body.projectStart)
    const projectImage = req.body.projectImage
    editProject(projectId,projectName,projectStart,projectPriority,projectDetail,projectImage)
    res.status(202).send(`${projectName} updated!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const findProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId
    const project = await getInfoProject(parseInt(projectId))
    res.status(200).send(project)
  } catch (error) {
    res.status(400).send(error)
  }
}
