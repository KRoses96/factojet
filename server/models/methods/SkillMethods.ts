import { AppDataSource } from "../src/data-source";
import { Skill } from "../src/entity/Skill";

export const addSkill = async (skillname : string) => {
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Skill)
    .values({
      name: skillname
    })
    .execute();
};

export const getSkills = async() => {
  return AppDataSource.manager.find(Skill)
}
