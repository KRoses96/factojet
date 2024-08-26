import type { Request, Response } from "express";
import { AppDataSource } from "../models/src/data-source";
import { Person } from "../models/src/entity/Person";
import { Project } from "../models/src/entity/Project";
import { Task } from "../models/src/entity/Task";
import { PersonAvailability } from "../models/src/entity/PersonAvailability";

type ScheduledTask = {
	resource: number;
	title: string;
	project: string;
	start: Date;
	end: Date;
};

type PossibleTask = {
	name: string;
	time: number;
	project: string;
	reqSkills: string[];
	reqTasks: string[];
	startDate: Date;
	prio: number;
};

type AvailablePeople = {
	name: number;
	skills: string[];
	importance: number;
};

//Should return a JSON with the planning
export const solutionFinder = async (req: Request, res: Response) => {
	const schedule: ScheduledTask[] = [];

	const people = await AppDataSource.manager
		.getRepository(Person)
		.find({ relations: { skills: true } });
	const peopleAvailabilities = await AppDataSource.manager
		.getRepository(PersonAvailability)
		.find({ relations: ["person", "person.skills"] });

	const projects = await AppDataSource.manager
		.getRepository(Project)
		.find({ relations: { tasks: true } });
	const tasks = await AppDataSource.manager
		.getRepository(Task)
		.find({ relations: { required: true, skills: true, project: true } });

	if (
		!people.length ||
		!peopleAvailabilities.length ||
		!projects.length ||
		!tasks.length
	)
		res.status(400).send("No Data");
	else {
		//Check all Skills within the factory
		const getTeamSkills = (): string[] => {
			const skills: string[] = [];
			for (const person of people) {
				for (const skill of person.skills) {
					if (!skills.includes(skill.name)) {
						skills.push(skill.name);
					}
				}
			}
			return skills;
		};
		const teamSkills = getTeamSkills();

		//Get all the possible tasks
		const getPossibleTasks = (): PossibleTask[] => {
			const possibleTasks: PossibleTask[] = [];
			let possible: number;
			for (const task of tasks) {
				possible = 1;
				for (const skill of task.skills) {
					if (!teamSkills.includes(skill.name)) {
						possible = 0;
					}
				}
				if (possible)
					possibleTasks.push({
						name: task.name,
						time: task.time,
						project: task.project.name,
						reqSkills: task.skills.map((skill) => skill.name),
						reqTasks: task.required.map((task) => task.name),
						startDate: task.project.start_date,
						prio: task.project.priority,
					});
			}
			return possibleTasks;
		};

		const possibleTasks = getPossibleTasks();
		const sortedPossibleTasks = possibleTasks.sort((a, b) => b.prio - a.prio);

		const startTime = projects.reduce((acc, project) =>
			project.start_date.getTime() < acc.start_date.getTime() ? project : acc,
		).start_date;

		const availablePeople = (time: number) => {
			const currentDate = new Date(time);
			const currentWeekDay = currentDate.getDay();
			const currentHour = currentDate.getHours();
			let available: PersonAvailability[] = [];
			switch (currentWeekDay) {
				case 0:
					available = peopleAvailabilities.filter(
						(person) =>
							person.sunday_start <= currentHour &&
							currentHour < person.sunday_end,
					);
					break;
				case 1:
					available = peopleAvailabilities.filter(
						(person) =>
							person.monday_start < currentHour &&
							currentHour < person.monday_end,
					);
					break;
				case 2:
					available = peopleAvailabilities.filter(
						(person) =>
							person.tuesday_start < currentHour &&
							currentHour < person.tuesday_end,
					);
					break;
				case 3:
					available = peopleAvailabilities.filter(
						(person) =>
							person.wednesday_start < currentHour &&
							currentHour < person.wednesday_end,
					);
					break;
				case 4:
					available = peopleAvailabilities.filter(
						(person) =>
							person.thursday_start < currentHour &&
							currentHour < person.thursday_end,
					);
					break;
				case 5:
					available = peopleAvailabilities.filter(
						(person) =>
							person.friday_start < currentHour &&
							currentHour < person.friday_end,
					);
					break;
				case 6:
					available = peopleAvailabilities.filter(
						(person) =>
							person.saturday_start < currentHour &&
							currentHour < person.saturday_end,
					);
					break;
			}
			if (available?.length) {
				const availablePeople: AvailablePeople[] = [];
				available.map((person) => {
					availablePeople.push({
						name: person.person.id,
						skills: person.person.skills.map((skill) => skill.name),
						importance: person.person.skills.length,
					});
				});

				return availablePeople.sort((a, b) => a.importance - b.importance);
			}
		};

		let nextTime = startTime.getTime() - 86400000;
		const completedTasks: Set<string> = new Set();
		const ongoingTasks: { [personName: string]: number } = {}; // Track end time of ongoing tasks for each person

		const lastTaskMap: { [key: string]: ScheduledTask } = {};

		const MAX_ITERATIONS = 10000; // Here to prevent possible infinite loops
		let iterations = 0;

		/* 
    TO DO:
    Add an importance value to each individual worker dependent on the number of hours in the 
    of all projects combined for example:
    Project 1 (100hours : CAD , 50hours: Welding)
    John (CAD,Welding) : 150 value
    Mat (CAD) : 100 value

    Picking from the worker with the least value to all projects.

    ------------

    Once Tools section is done, add a check to see which tools are available,
    create an importance scaling for it too

    ------------

    Create filters for each individual worker, from junior,mid,senior so that
    the manager can pick the type of skill level to attribute to each task. 
    */

		while (sortedPossibleTasks.length > 0 && iterations < MAX_ITERATIONS) {
			const peopleAvailable = availablePeople(nextTime);

			++iterations;

			if (peopleAvailable) {
				sortedPossibleTasks.forEach((task, index) => {
					const prerequisitesCompleted = task.reqTasks.every((reqTask) =>
						completedTasks.has(reqTask),
					);

					if (
						prerequisitesCompleted &&
						new Date(task.startDate).getTime() - 86400000 <= nextTime
					) {
						let person: AvailablePeople | undefined;
						let canDo = false;

						for (const p of peopleAvailable) {
							if (!ongoingTasks[p.name] || ongoingTasks[p.name] <= nextTime) {
								canDo = task.reqSkills.every((skill) =>
									p.skills.includes(skill),
								);
								if (canDo) {
									person = p;
									break;
								}
							}
						}

						if (person) {
							const personKey = `${person.name}-${task.project}-${task.name}`;
							const lastTask = lastTaskMap[personKey];

							if (lastTask && lastTask.end.getTime() === nextTime) {
								lastTask.end = new Date(nextTime + 3600000);
							} else {
								const scheduledTask: ScheduledTask = {
									start: new Date(nextTime),
									end: new Date(nextTime + 3600000),
									title: `${task.project} - ${task.name}`,
									resource: person.name,
									project: task.project,
								};

								schedule.push(scheduledTask);
								lastTaskMap[personKey] = scheduledTask;
							}

							ongoingTasks[person.name] = nextTime + 3600000;

							task.time -= 1;

							if (task.time <= 0) {
								completedTasks.add(task.name);
								sortedPossibleTasks.splice(index, 1);
								delete ongoingTasks[person.name];
							}
						}
					}
				});
			}
			nextTime += 3600000; // Move to the next hour
		}

		res.status(200).json(schedule);
	}
};
