import express from "express";
import { allSkills, insertSkill } from "../controllers/SkillController";
import {  allPeople, insertPerson, insertSkillToPerson, removePerson, removeSkillToPerson } from "../controllers/PersonController";
import { allProjects, findProject, insertProject, removeProject, updateProject } from "../controllers/ProjectController";
import { allTasks, insertTask, removeTask } from "../controllers/TaskController";
import { allAvailability, insertAvailability } from "../controllers/PersonAvailabilityController";
import { allTools, insertTool, removeTool } from "../controllers/ToolController";
import { deleteSkill } from "../models/methods/SkillMethods";
import { solutionFinder } from "../controllers/SolutionController";
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
router.post('/avaliability', insertAvailability)
router.get('/avaliability',allAvailability)
router.post('/skillToPerson', insertSkillToPerson)
router.delete('/skillToPerson', removeSkillToPerson)

//Project
router.post('/project', insertProject)
router.delete('/project/:projectId', removeProject)
router.get('/project',allProjects)
router.put('/project', updateProject)
router.get('/project/:projectId', findProject)

//Task
router.post('/task',insertTask)
router.delete('/task',removeTask)
router.get('/task',allTasks)

//Tools
router.post('/tool',insertTool)
router.delete('/tool',removeTool)
router.get('/tool',allTools)


//Plan
router.get('/solution', solutionFinder)

export {router}