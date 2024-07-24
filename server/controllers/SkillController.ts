import { addSkill, getSkills } from "../models/methods/SkillMethods";
import { Request, Response } from "express";

export const insertSkill = async (req: Request, res: Response) => {
  try {
    const skillName = req.body.skillname;
    await addSkill(skillName);
    res.status(201).send(`${skillName} added!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const allSkills = async (req: Request, res: Response) => {
  try {
    const skills = await getSkills();
    res.status(200).send(skills);
  } catch (error) {
    res.status(400).send(error);
  }
};
