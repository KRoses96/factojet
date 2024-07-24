import express from "express";
import "reflect-metadata"
const app = express();
const PORT = 3000;
import cors from "cors"
import { router } from "./routers/router";

//middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);

//Run
app.listen(PORT, async () => {
  console.log("server running!");
});