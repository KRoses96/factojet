import { useState } from "react";

export const TaskManager = ({projectId} : {projectId:number}) => {

  const [tasks,setTasks] = useState([])

  return <>TaskManager {projectId}</>;
};
