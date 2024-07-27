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

    const skill = await AppDataSource.manager.findOneBy(Skill, {
      name: skillname,
    });

  //In case I decide to add the tools feauture
  if (tools) {
  const requiredTools = tools.split(",");
  for (let tool of requiredTools) {
    console.log(tool)
    const toolId = await AppDataSource.manager
      .findOneBy(Tool, {
        name: tool,
      })
      if(toolId) {
    await AppDataSource.createQueryBuilder()
      .relation(Tool, "skills")
      .of(toolId)
      .add(skill);
      }
  }
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

