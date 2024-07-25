import { AppDataSource } from "../src/data-source";
import { Skill } from "../src/entity/Skill";
import { Tool } from "../src/entity/Tool";

export const addSkill = async (skillname: string, tools: string) => {
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Skill)
    .values({
      name: skillname,
    })
    .execute();

  const requiredTools = tools.split(",");
  for (let tool of requiredTools) {
    const toolId = await AppDataSource.manager
      .findOneBy(Tool, {
        name: tool,
      })
      .then((toolFound) => (toolFound ? toolFound.id : null));

    await AppDataSource.createQueryBuilder()
      .relation(Tool, "tasks")
      .of(tool)
      .add(toolId);
  }
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

