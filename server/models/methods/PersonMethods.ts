import { AppDataSource } from "../src/data-source";
import { Person } from "../src/entity/Person";
import { Skill } from "../src/entity/Skill";
import { addSkill } from "./SkillMethods";

export const addPerson = async (name: string) => {
	await AppDataSource.createQueryBuilder()
		.insert()
		.into(Person)
		.values({
			name: name,
		})
		.execute();
};

export const deletePerson = async (id: number) => {
	await AppDataSource.createQueryBuilder()
		.delete()
		.from(Person)
		.where("id = :id", { id: id })
		.execute();
};

export const getPeople = async () => {
	return AppDataSource.manager
		.getRepository(Person)
		.find({ relations: { skills: true } });
};

export const getInfoPerson = async (personId: number) => {
	const person = await AppDataSource.getRepository(Person).findOne({
		where: {
			id: personId,
		},
		relations: ["skills"],
	});
	return person;
};

export const updatePerson = async (personId: number, personName: string) => {
	await AppDataSource.createQueryBuilder()
		.update(Person)
		.set({ name: personName })
		.where("id = :id", { id: personId })
		.execute();
};

export const addSkillToPerson = async (
	personName: string,
	skillName: string,
) => {
	let skillToAdd = await AppDataSource.manager.findOneBy(Skill, {
		name: skillName,
	});
	console.log("skillToAdd", skillToAdd);
	if (!skillToAdd) {
		await addSkill(skillName, null);

		skillToAdd = await AppDataSource.manager.findOneBy(Skill, {
			name: skillName,
		});
	}

	const person = await AppDataSource.manager.findOneBy(Person, {
		name: personName,
	});

	if (person && skillToAdd) {
		await AppDataSource.createQueryBuilder()
			.relation(Person, "skills")
			.of(person)
			.add(skillToAdd);
	}
};

export const deleteSkillToPerson = async (
	personName: string,
	skillName: string,
) => {
	const skillToRemove = await AppDataSource.manager.findOneBy(Skill, {
		name: skillName,
	});

	const person = await AppDataSource.manager.findOneBy(Person, {
		name: personName,
	});

	if (person && skillToRemove) {
		await AppDataSource.createQueryBuilder()
			.relation(Person, "skills")
			.of(person)
			.remove(skillToRemove);
	}
};
