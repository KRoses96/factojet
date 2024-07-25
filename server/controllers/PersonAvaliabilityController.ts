import { Request, Response } from "express";
import { addAvaliability, getAvaliability } from "../models/methods/PersonAvaliabilityMethods";

export const insertAvaliability = (req: Request, res: Response) => {
  try {
    const personName = req.body.personName || null;
    const monday_start = req.body.monday_start || null;
    const monday_end = req.body.monday_end || null;
    const tuesday_start = req.body.tuesday_start || null;
    const tuesday_end = req.body.tuesday_end || null;
    const wednesday_start = req.body.wednesday_start || null;
    const wednesday_end = req.body.wednesday_end || null;
    const thursday_start = req.body.thursday_start || null;
    const thursday_end = req.body.thursday_end || null;
    const friday_start = req.body.friday_start || null;
    const friday_end = req.body.friday_end || null;
    const saturday_start = req.body.saturday_start || null;
    const saturday_end = req.body.saturday_end || null;
    const sunday_start = req.body.sunday_start || null;
    const sunday_end = req.body.sunday_end || null;

    addAvaliability(
      personName,
      monday_start,
      monday_end,
      tuesday_start,
      tuesday_end,
      wednesday_start,
      wednesday_end,
      thursday_start,
      thursday_end,
      friday_start,
      friday_end,
      saturday_start,
      saturday_end,
      sunday_start,
      sunday_end
    );
    res.status(201).send('Avaliability added!')
  } catch (error) {
    res.status(400).send(error);
  }
};


export const allAvaliability = async (req: Request , res: Response) => {
  try {
    const avaliability = await getAvaliability();
    res.status(200).send(avaliability);
  } catch (error) {
    res.status(400).send(error);
  }
}