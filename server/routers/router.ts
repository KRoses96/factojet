import express from "express";
import { allSkills, insertSkill } from "../controllers/SkillController";
import {  allAvailability, allPeople, findPerson, insertAvailability, insertPerson, insertSkillToPerson, removePerson, removeSkillToPerson, updateInfoPerson } from "../controllers/PersonController";
import { allProjects, findProject, insertProject, removeProject, updateProject } from "../controllers/ProjectController";
import { allTasks, infoTask, insertTask, removeTask } from "../controllers/TaskController";
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
router.put('/people', updateInfoPerson)
router.delete('/people/:personId',removePerson)
router.get('/people', allPeople)
router.post('/avaliability', insertAvailability)
router.get('/avaliability',allAvailability)
router.post('/skillToPerson', insertSkillToPerson)
router.delete('/skillToPerson', removeSkillToPerson)
router.get('/people/:personId', findPerson)

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
router.get('/task/:taskId', infoTask)

//Tools
router.post('/tool',insertTool)
router.delete('/tool',removeTool)
router.get('/tool',allTools)


//Plan
router.get('/solution', solutionFinder)

export {router}