import { AppDataSource } from "../src/data-source";
import { PersonAvaliability } from "../src/entity/PersonAvailability";
import { Person } from "../src/entity/Person";

export const addAvailability = async (
  personName: string,
  monday_start: number | null,
  monday_end: number | null,
  tuesday_start: number | null,
  tuesday_end: number | null,
  wednesday_start: number | null,
  wednesday_end: number | null,
  thursday_start: number | null,
  thursday_end: number | null,
  friday_start: number | null,
  friday_end: number | null,
  saturday_start: number | null,
  saturday_end: number | null,
  sunday_start: number | null,
  sunday_end: number | null
) => {
  console.log("hello");
  const personId = await AppDataSource.manager
    .findOneBy(Person, {
      name: personName,
    })
    .then((personFound) => (personFound ? personFound.id : null));

  if (personId) {
    const avaliabilityId = await AppDataSource.manager
      .findOneBy(PersonAvaliability, {
        person: { id: personId },
      })
      .then((scheduleFound) => (scheduleFound ? scheduleFound.id : null));

    if (avaliabilityId) {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(PersonAvaliability)
        .where("id = :id", { id: avaliabilityId })
        .execute();
    }

    await AppDataSource.createQueryBuilder()
      .insert()
      .into(PersonAvaliability)
      .values({
        person: { id: personId },
        monday_start: monday_start && monday_end ? monday_start : 0,
        monday_end: monday_start && monday_end ? monday_end : 0,
        tuesday_start: tuesday_start && tuesday_end ? tuesday_start : 0,
        tuesday_end: tuesday_start && tuesday_end ? tuesday_end : 0,
        wednesday_start: wednesday_start && wednesday_end ? wednesday_start : 0,
        wednesday_end: wednesday_start && wednesday_end ? wednesday_end : 0,
        thursday_start: thursday_start && thursday_end ? thursday_start : 0,
        thursday_end: thursday_start && thursday_end ? thursday_end : 0,
        friday_start: friday_start && friday_end ? friday_start : 0,
        friday_end: friday_start && friday_end ? friday_end : 0,
        saturday_start: saturday_start && saturday_end ? saturday_start : 0,
        saturday_end: saturday_start && saturday_end ? saturday_end : 0,
        sunday_start: sunday_start && sunday_end ? sunday_start : 0,
        sunday_end: sunday_start && sunday_end ? sunday_end : 0,
      })
      .execute();
  }
};

export const getAvaliability = async () => {
  return AppDataSource.getRepository(PersonAvaliability).find({
    relations: ["person", "person.skills"],
  });
};

export const getSingleAvaliability = async (personId: number) => {
  return AppDataSource.getRepository(PersonAvaliability).findOne({
    where: {
      person: { id: personId },
    },
    relations: ["person", "person.skills"],
  });
};
