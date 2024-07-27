import { Request, Response } from "express";
import {
  addPerson,
  getPeople,
  addSkillToPerson,
  deleteSkillToPerson,
  deletePerson,
} from "../models/methods/PersonMethods";
import { addAvailability } from "../models/methods/PersonAvaliabilityMethods";

export const insertPerson = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { personName, availability, skills } = req.body;
    await addPerson(personName);
    console.log(availability);
    await addAvailability(
      personName,
      availability.monday_start,
      availability.monday_end,
      availability.tuesday_start,
      availability.tuesday_end,
      availability.wednesday_start,
      availability.wednesday_end,
      availability.thursday_start,
      availability.thursday_end,
      availability.friday_start,
      availability.friday_end,
      availability.saturday_start,
      availability.saturday_end,
      availability.sunday_start,
      availability.sunday_end
    );
    skills.forEach(async (skill: string) => {
      await addSkillToPerson(personName, skill);
    });
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
