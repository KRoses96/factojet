import express from "express";
import { allSkills, insertSkill } from "../controllers/SkillController";
import {  allPeople, insertPerson, insertSkillToPerson, removePerson, removeSkillToPerson } from "../controllers/PersonController";
import { allProjects, insertDetailProject, insertProject, removeProject } from "../controllers/ProjectController";
import { allTasks, insertTask, removeTask } from "../controllers/TaskController";
import { allAvaliability, insertAvaliability } from "../controllers/PersonAvaliabilityController";
import { allTools, insertTool, removeTool } from "../controllers/ToolController";
import { deleteSkill } from "../models/methods/SkillMethods";
const router = express.Router();

router.get('/', (req, res) => {
res.status(200).send('Hello')
})

//Skills
router.post('/skill', insertSkill)
router.delete('/skill', deleteSkill)
router.get('/skill', allSkills)

//Person
router.post('/people', insertPerson)
router.delete('/people',removePerson)
router.get('/people', allPeople)
router.post('/avaliability', insertAvaliability)
router.get('/avaliability',allAvaliability)
router.post('/skillToPerson', insertSkillToPerson)
router.delete('/skillToPerson', removeSkillToPerson)

//Project
router.post('/project', insertProject)
router.delete('/project', removeProject)
router.get('/project',allProjects)
router.put('/project', insertDetailProject)

//Task
router.post('/task',insertTask)
router.delete('/task',removeTask)
router.get('/task',allTasks)

//Tools
router.post('/tool',insertTool)
router.delete('/tool',removeTool)
router.get('/tool',allTools)
export {router}