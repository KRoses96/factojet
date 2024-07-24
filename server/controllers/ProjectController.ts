import { Request, Response } from "express";
import {
  addProject,
  deleteProject,
  getProjects,
} from "../models/methods/ProjectMethods";

export const insertProject = async (req: Request, res: Response) => {
  try {
    const projectName = req.body.projectName;
    const projectStartDate = req.body.projectStart;
    await addProject(projectName, projectStartDate);
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
    res.status(202).send(`${projectDetail} added to ${projectName}!`);
  } catch (error) {
    res.status(400).send(error);
  }
};
