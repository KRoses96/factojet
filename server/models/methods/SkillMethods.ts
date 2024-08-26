import { AppDataSource } from "../src/data-source";
import { Skill } from "../src/entity/Skill";
import { Tool } from "../src/entity/Tool";

export const addSkill = async (skillname: string, tools: string | null) => {
	await AppDataSource.createQueryBuilder()
		.insert()
		.into(Skill)
		.values({
			name: skillname,
		})
		.execute();
};

export const getSkills = async () => {
	return AppDataSource.manager.find(Skill);
};

export const deleteSkill = async (name: string) => {
	await AppDataSource.createQueryBuilder()
		.delete()
		.from(Skill)
		.where("name = :name", { name: name })
		.execute();
};
