import { addSkill, deleteSkill, getSkills } from "../models/methods/SkillMethods";
import type { Request, Response } from "express";

export const insertSkill = async (req: Request, res: Response) => {
  try {
    const {skillName} = req.body;
    const tools = req.body.tools
    await addSkill(skillName,tools);
    res.status(201).send(`${skillName} added!`);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const removeSkill = async (req: Request, res: Response) => {
  try {
    const {skillName} = req.body
    await deleteSkill(skillName);
    res.status(201).send(`${skillName} removed!`);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const allSkills = async (req: Request, res: Response) => {
  try {
    const skills = await getSkills();
    res.status(200).send(skills);
  } catch (error) {
    res.status(500).send(error);
  }
};

