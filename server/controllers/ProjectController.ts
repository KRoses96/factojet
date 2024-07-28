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
    await addProject(projectName, projectStart, projectPriority,projectDetail);
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
    const projectName = req.body.projectName;
    await deleteProject(projectName);
    res.status(201).send(`${projectName} removed!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const insertDetailProject = async (req: Request, res: Response) => {
  try {
    const projectName = req.body.projectName;
    const projectDetail = req.body.projectDetail;
   // editProject()
    res.status(202).send(`${projectDetail} added to ${projectName}!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const findProject = async (req: Request, res: Response) => {
  try {
    console.log('yes')
    const projectName = req.body.projectName
    const project = await getInfoProject(projectName)
    res.status(200).send(project)
  } catch (error) {
    res.status(400).send(error)
  }
}
