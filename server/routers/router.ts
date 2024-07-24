import express from "express";
import { allSkills, insertSkill } from "../controllers/SkillController";
import {  allPeople, insertPerson, insertSkillToPerson, removePerson, removeSkillToPerson } from "../controllers/PersonController";
import { allProjects, insertDetailProject, insertProject, removeProject } from "../controllers/ProjectController";
import { insertTask, removeTask } from "../controllers/TaskController";
const router = express.Router();

router.get('/', (req, res) => {
res.status(200).send('Hello')
})

//Skills
router.post('/skills', insertSkill)
router.get('/skills', allSkills)

//Person
router.post('/people', insertPerson)
router.delete('/people',removePerson)
router.get('/people', allPeople)

//Person-skill
router.post('/skillToPerson', insertSkillToPerson)
router.delete('/skillToPerson', removeSkillToPerson)

//Project
router.post('/project', insertProject)
router.delete('/project', removeProject)
router.get('/project',allProjects)
router.put('/projectDetail', insertDetailProject)

//Task
router.post('/task',insertTask)
router.delete('/task',removeTask)

export {router}