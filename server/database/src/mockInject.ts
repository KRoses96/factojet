import { AppDataSource } from "./data-source";
import { Skill } from "./entity/Skill";

export const insertSkill = async () => {
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Skill)
    .values({ name: "Cooking" })
    .execute();
};
