import { Request, Response } from "express";
import { addTool, deleteTool, getTools } from "../models/methods/ToolMethods";

export const insertTool = async (req: Request, res: Response) => {
  try {
    const toolName = req.body.toolName;
    const toolQuant = req.body.toolQuant;
    await addTool(toolName, toolQuant);
    res.status(201).send(`${toolName} added!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const removeTool = async (req: Request, res: Response) => {
  try {
    const toolName = req.body.toolName;
    await deleteTool(toolName);
    res.status(201).send(`${toolName} removed!`);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const allTools = async (req: Request, res: Response) => {
  try {
    const tools = await getTools();
    res.status(200).send(tools);
  } catch (error) {
    res.status(400).send(error);
  }
};

