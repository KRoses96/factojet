import express from "express";
import { allSkills, insertSkill } from "../controllers/SkillController";
import {  allPeople, insertPerson, insertSkillToPerson, removeSkillToPerson } from "../controllers/PersonController";
const router = express.Router();

router.get('/', (req, res) => {
res.status(200).send('Hello')
})

//Skills
router.post('/skills', insertSkill)
router.get('/skills', allSkills)

//Person
router.post('/people', insertPerson)
router.get('/people', allPeople)

//Person-skill
router.post('/skillToPerson', insertSkillToPerson)
router.delete('/skillToPerson', removeSkillToPerson)

export {router}