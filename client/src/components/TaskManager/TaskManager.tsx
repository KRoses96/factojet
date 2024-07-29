import { Badge, Button, Modal, Space, Table } from '@mantine/core';
import { Fragment, useEffect, useState } from 'react';
import { generateColorRGB } from '@marko19907/string-to-color';
import { useDisclosure } from '@mantine/hooks';
import { TaskForm } from '../TaskForm/TaskForm';

const colorOptions = { saturation: 50, lightness: 55, alpha: 80 };

export type Skill = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  name: string;
  time: number;
  skills: Skill[];
  required: Task[];
};

export const TaskManager = ({ projectId , onAddProject }: { projectId: number, onAddProject: () => void; }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTask, setSelectedTask] = useState<number | null>(0)



  const handleAddTask = () => {
    getAllTasks();
    handleCloseModal()
    onAddProject()
  };

  const handleRowClick = (taskId: number) => {
    setSelectedTask(taskId);
    open();
  };

  const handleCloseModal = () => {
    close();
    setSelectedTask(null);
  };

  const getAllTasks = () => {
    const url = 'http://localhost:3000/project/' + projectId;
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTasks(data.tasks);
      });
  }

  useEffect(() => {
    try {
      setInterval(getAllTasks,40);
    } catch (err) {
      console.log('failed to update')
    }
  }, []);

  const rows = tasks.map((task) => (
    
    <Table.Tr onClick={() => handleRowClick(task.id)} key={task.id}>
      <Table.Td>{task.name}</Table.Td>
      <Table.Td>{task.time}</Table.Td>
      <Table.Td>
        {task.skills.map((skill) => (
          <Fragment key={skill.id}>
            <Badge className="skills" color={generateColorRGB(skill.name, colorOptions)}>
              {skill.name}
            </Badge>
            <span> </span>
          </Fragment>
        ))}
      </Table.Td>
      <Table.Td>
        {task.required.map((req) => (
          <Fragment key={req.id}>
            <Badge className="skills" color={generateColorRGB(req.name, colorOptions)}>
              {req.name}
            </Badge>
            <span> </span>
          </Fragment>
        ))}
      </Table.Td>
    </Table.Tr>
  ));


  return (
    <>
    <Modal size="lg" opened={opened} onClose={handleCloseModal} title={selectedTask? 'Edit Task' : 'New Task'}>
        <TaskForm projectId = {projectId} selectedTask = {selectedTask} onAddTask={handleAddTask}/>
    </Modal>

    <Button onClick={open} variant="outline" size="md" radius="lg">
        Add Task
      </Button>

    <Space h='md'/>
    <Table
    stickyHeader
    stickyHeaderOffset={60}
    striped
    highlightOnHover
    withTableBorder
    withColumnBorders
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Task</Table.Th>
          <Table.Th>Time(Hours)</Table.Th>
          <Table.Th>Skillsets Necessary</Table.Th>
          <Table.Th>Tasks Required</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
    </>
  );
};
