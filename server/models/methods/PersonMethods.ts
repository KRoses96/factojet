import { AppDataSource } from "../src/data-source";
import { Person } from "../src/entity/Person";
import { Skill } from "../src/entity/Skill";

export const addPerson = async (name: string) => {
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Person)
    .values({
      name: name,
    })
    .execute();
};

export const deletePerson = async (name: string) => {
  await AppDataSource.createQueryBuilder()
    .delete()
    .from(Person)
    .where("name = :name", { name: name })
    .execute();
};

export const getPeople = async () => {
  return AppDataSource.manager.find(Person);
};

export const addSkillToPerson = async (
  personName: string,
  skillName: string
) => {
  const skillToAdd = await AppDataSource.manager.findOneBy(Skill, {
    name: skillName,
  });

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
  skillName: string
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
