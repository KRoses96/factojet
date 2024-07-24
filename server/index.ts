import express from "express";
import "reflect-metadata"
const app = express();
const PORT = 3000;
import cors from "cors"
import { router } from "./routers/router";
import { AppDataSource } from "./models/src/data-source";

//middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);


//Run
AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, async () => {
      console.log("server running!");
    });
  })
  .catch((error) => console.log(error));
