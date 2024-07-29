import { Request, Response } from "express";
import { AppDataSource } from "../models/src/data-source";
import { Person } from "../models/src/entity/Person";
import { Project } from "../models/src/entity/Project";
import { Task } from "../models/src/entity/Task";
import { PersonAvaliability } from "../models/src/entity/PersonAvailability";

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

type AvaliablePeople = {
  name: number;
  skills: string[];
  importance: number;
};

//Should return a JSON with the planning
export const solutionFinder = async (req: Request, res: Response) => {
  const schedule: ScheduledTask[] = [];

  //Tables
  const people = await AppDataSource.manager
    .getRepository(Person)
    .find({ relations: { skills: true } });
  const peopleAvaliabilities = await AppDataSource.manager
    .getRepository(PersonAvaliability)
    .find({ relations: ["person", "person.skills"] });

  const projects = await AppDataSource.manager
    .getRepository(Project)
    .find({ relations: { tasks: true } });
  const tasks = await AppDataSource.manager
    .getRepository(Task)
    .find({ relations: { required: true, skills: true, project: true } });

  if (
    !people.length ||
    !peopleAvaliabilities.length ||
    !projects.length ||
    !tasks.length
  )
    res.status(400).send("No Data");
  else {
    //Check all Skills within the factory
    const getTeamSkills = (): string[] => {
      const skills: string[] = [];
      for (let person of people) {
        for (let skill of person.skills) {
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
      let possible;
      for (let task of tasks) {
        possible = 1;
        for (let skill of task.skills) {
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

    let startTime = projects.reduce((acc, project) =>
      project.start_date.getTime() < acc.start_date.getTime() ? project : acc
    ).start_date;

    const avaliablePeople = (time: number) => {
      const currentDate = new Date(time);
      const currentWeekDay = currentDate.getDay();
      const currentHour = currentDate.getHours();
      let avaliable;
      switch (currentWeekDay) {
        case 0:
          avaliable = peopleAvaliabilities.filter(
            (person) =>
              person.sunday_start <= currentHour &&
              currentHour < person.sunday_end
          );
          break;
        case 1:
          avaliable = peopleAvaliabilities.filter(
            (person) =>
              person.monday_start < currentHour &&
              currentHour < person.monday_end
          );
          break;
        case 2:
          avaliable = peopleAvaliabilities.filter(
            (person) =>
              person.tuesday_start < currentHour &&
              currentHour < person.tuesday_end
          );
          break;
        case 3:
          avaliable = peopleAvaliabilities.filter(
            (person) =>
              person.wednesday_start < currentHour &&
              currentHour < person.wednesday_end
          );
          break;
        case 4:
          avaliable = peopleAvaliabilities.filter(
            (person) =>
              person.thursday_start < currentHour &&
              currentHour < person.thursday_end
          );
          break;
        case 5:
          avaliable = peopleAvaliabilities.filter(
            (person) =>
              person.friday_start < currentHour &&
              currentHour < person.friday_end
          );
          break;
        case 6:
          avaliable = peopleAvaliabilities.filter(
            (person) =>
              person.saturday_start < currentHour &&
              currentHour < person.saturday_end
          );
          break;
      }
      if (avaliable && avaliable.length) {
        const avaliablePeople: AvaliablePeople[] = [];
        avaliable.forEach((person) => {
          avaliablePeople.push({
            name: person.person.id,
            skills: person.person.skills.map((skill) => skill.name),
            importance: person.person.skills.length,
          });
        });

        return avaliablePeople.sort((a, b) => a.importance - b.importance);
      }
    };

    let nextTime = startTime.getTime();
    const completedTasks: Set<string> = new Set();
    const ongoingTasks: { [personName: string]: number } = {}; // Track end time of ongoing tasks for each person

    let lastTaskMap: { [key: string]: ScheduledTask } = {};

    const MAX_ITERATIONS = 10000; //Adding some extra logic will allow you to remove max iterations
    let iterations = 0; //Keeping max iterations while working on the proff of concept
    while (sortedPossibleTasks.length > 0 && iterations < MAX_ITERATIONS) {
      let peopleAvaliable = avaliablePeople(nextTime);

      ++iterations;

      if (peopleAvaliable) {
        sortedPossibleTasks.forEach((task, index) => {
          const prerequisitesCompleted = task.reqTasks.every((reqTask) =>
            completedTasks.has(reqTask)
          );

          if (
            prerequisitesCompleted &&
            new Date(task.startDate).getTime() <= nextTime
          ) {
            let person: AvaliablePeople | undefined;
            let canDo = false;

            for (let p of peopleAvaliable) {
              if (!ongoingTasks[p.name] || ongoingTasks[p.name] <= nextTime) {
                canDo = task.reqSkills.every((skill) =>
                  p.skills.includes(skill)
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
                  title: task.project + " - " + task.name,
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
