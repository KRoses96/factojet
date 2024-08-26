import type { Request, Response } from "express";
import {
	addPerson,
	getPeople,
	addSkillToPerson,
	deleteSkillToPerson,
	deletePerson,
	getInfoPerson,
	updatePerson,
} from "../models/methods/PersonMethods";
import {
	addAvailability,
	getAvailability,
	getSingleAvailability,
} from "../models/methods/PersonAvailabilityMethods";

export const insertPerson = async (req: Request, res: Response) => {
	try {
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
			availability.sunday_end,
		);
		skills.map(async (skill: string) => {
			await addSkillToPerson(personName, skill);
		});
		res.status(201).send(`${personName} added!`);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const removePerson = async (req: Request, res: Response) => {
	try {
		const personId = req.params.personId;
		await deletePerson(Number(personId));
		res.status(201).send(`${personId} removed!`);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const allPeople = async (req: Request, res: Response) => {
	try {
		const people = await getPeople();
		res.status(200).send(people);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const findPerson = async (req: Request, res: Response) => {
	try {
		const personId = req.params.personId;
		const person = await getSingleAvailability(Number(personId));
		res.status(200).send(person);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const insertSkillToPerson = async (req: Request, res: Response) => {
	try {
		const { person, skill } = req.body;
		addSkillToPerson(person, skill);
		res.status(201).send(`${skill} added  to ${person}`);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const removeSkillToPerson = async (req: Request, res: Response) => {
	try {
		const { person, skill } = req.body;
		deleteSkillToPerson(person, skill);
		res.status(201).send(`${skill} removed from ${person}`);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const insertAvailability = (req: Request, res: Response) => {
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

		addAvailability(
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
			sunday_end,
		);
		res.status(201).send("Availability added!");
	} catch (error) {
		res.status(500).send(error);
	}
};

export const allAvailability = async (req: Request, res: Response) => {
	try {
		const availability = await getAvailability();
		res.status(200).send(availability);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const updateInfoPerson = async (req: Request, res: Response) => {
	try {
		const { personId, personName, skills, availability } = req.body;
		const personToEdit = await getInfoPerson(personId);

		updatePerson(personId, personName);
		const skillsDb = personToEdit?.skills.map((skill) => skill.name);

		const skillsToRemove: string[] = [];
		const skillsToAdd: string[] = [];

		if (skillsDb) {
			skills.map((skill: string) => {
				if (!skillsDb.includes(skill)) skillsToAdd.push(skill);
			});

			skillsDb.map((skill: string) => {
				if (!skills.includes(skill)) skillsToRemove.push(skill);
			});
		}

		if (skillsToRemove.length > 0) {
			skillsToRemove.map((skill) => {
				deleteSkillToPerson(personName, skill);
			});
		}

		if (skills)
			skillsToAdd.map((skill) => {
				addSkillToPerson(personName, skill);
			});

		addAvailability(
			personName,
			availability.monday_start,
			availability.monday_end,
			availability.tuesday_start,
			availability.tuesday_end,
			availability.wednesday_start,
			availability.wednesday_end,
			availability.thursday_start,
			availability.thursday_start,
			availability.friday_start,
			availability.friday_end,
			availability.saturday_start,
			availability.saturday_end,
			availability.sunday_start,
			availability.sunday_end,
		);

		res.status(201).send(`${personName} updated!`);
	} catch (error) {
		res.status(500).send(error);
	}
};
