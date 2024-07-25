import { AppDataSource } from "../src/data-source"
import { Tool } from "../src/entity/Tool";


export const addTool = async (
  toolName: string,
  quantity: number,

) => {

  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Tool)
    .values({
      name: toolName,
      quantity: quantity
    })
    .execute();

}



export const deleteTool = async (name: string) => {
  await AppDataSource.createQueryBuilder()
    .delete()
    .from(Tool)
    .where("name = :name", { name: name })
    .execute();
};


export const getTools = async () => {
  return AppDataSource.manager.find(Tool);
};