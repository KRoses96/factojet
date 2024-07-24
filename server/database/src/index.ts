import { AppDataSource } from "./data-source";
import { Skill } from "./entity/Skill";
import { insertSkill } from "./mockInject";

AppDataSource.initialize()
  .then(async () => {

    //Test Injection
    await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(Skill)
    .values([
        {name: "test"}
    ])
    .execute()

    console.log("Database Running")
  })
  .catch((error) => console.log(error));


  