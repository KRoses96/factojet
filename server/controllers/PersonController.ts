import { Request, Response } from "express";
import {
  addPerson,
  getPeople,
  addSkillToPerson,
  deleteSkillToPerson,
  deletePerson,
} from "../models/methods/PersonMethods";

export const insertPerson = async (req: Request, res: Response) => {
  try {
    const personName = req.body.personName;
    await addPerson(personName);
    res.status(201).send(`${personName} added!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const removePerson = async (req: Request, res: Response) => {
  try {
    const personName = req.body.personName;
    await deletePerson(personName);
    res.status(201).send(`${personName} removed!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const allPeople = async (req: Request, res: Response) => {
  try {
    const people = await getPeople();
    res.status(200).send(people);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const insertSkillToPerson = async (req: Request, res: Response) => {
  try {
    const person = req.body.personName;
    const skill = req.body.skillName;
    addSkillToPerson(person, skill);
    res.status(201).send(`${skill} added  to ${person}`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const removeSkillToPerson = async (req: Request, res: Response) => {
  try {
    const person = req.body.personName;
    const skill = req.body.skillName;
    deleteSkillToPerson(person, skill);
    res.status(201).send(`${skill} removed from ${person}`);
  } catch (error) {
    res.status(400).send(error);
  }
};
