import { Card, Flex, ColorSwatch, Table, Space, Text, Divider, Button, Modal } from '@mantine/core';
import { useState, useEffect, Fragment } from 'react';
import { DonutChart } from '@mantine/charts';
import { generateColorRGB } from '@marko19907/string-to-color';
import './ProjectCard.css';
import { useDisclosure } from '@mantine/hooks';
import { ProjectForm } from '../ProjectForm/ProjectForm';

type RespProject = {
  id: number;
  name: string;
  details: string | null;
  start_date: Date;
  priority: number;
  tasks: {
    id: number;
    name: string;
    time: number;
    complete: boolean;
    skills: { id: string; name: string }[];
  }[];
};

type Skill = {
  name: string;
  time: number;
};

type Task = {
  name: string;
  time: number;
  skills: Skill[];
};

type Project = {
  id: number;
  name: string;
  detail: string;
  tasks: Task[];
  start: Date;
  prio: string;
  skills: Skill[];
};

type AggregatedSkillTimes = {
  [key: string]: number;
};

const colorOptions = { saturation: 50, lightness: 55, alpha: 80 };

export const ProjectCard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editProject, setEditProject] = useState<number>(0)
  const [openedNP, { open: openNP, close: closeNP }] = useDisclosure(false);
  const [openedTM, { open: openTM, close: closeTM }] = useDisclosure(false);
  const [openedEP, { open: openEP, close: closeEP }] = useDisclosure(false);

  const handleAddProject = () => {
    getAllProjects();
    closeNP();
    closeEP();
  };

  const handleEditProject = (projectId : number) => {
    setEditProject(projectId)
    openEP()
  }

  const prioText = {
    0: 'Ignore',
    25: 'Low',
    50: 'Normal',
    75: 'High',
    100: 'Urgent',
  };

  const getAllProjects = () => {
    const url = 'http://localhost:3000/project';
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) =>
        setProjects(
          data.map((project: RespProject) => {
            let skills;
            // Aggregate skill times
            if (project.tasks.length) {
              const skillTimes = project.tasks
                .flatMap((task) =>
                  task.skills.map((skill) => ({
                    name: skill.name,
                    time: task.time,
                  }))
                )
                .reduce((acc, { name, time }) => {
                  acc[name] = (acc[name] || 0) + time;
                  return acc;
                }, {} as AggregatedSkillTimes);
              skills = Object.entries(skillTimes).map(([name, time]) => ({ name, time }));
            }

            if (!skills) {
              skills = [{}]; //In case there are no tasks on a project
            }

            return {
              id: project.id,
              name: project.name,
              detail: project.details,
              tasks: project.tasks.map((task) => task.name),
              skills: skills,
              prio: prioText[project.priority as keyof typeof prioText],
              start: project.start_date,
            };
          })
        )
      );
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  const cards = projects.map((project, i) => (
    <Fragment key={i}>
      <Flex mih={50} gap="md" justify="left" align="center" direction="row" wrap="nowrap">
        <div className="card">
          <Card shadow="sm" padding="xl" component="a" target="_blank">
            <Card.Section>
              <Text fw={500} size="xl" ta="center">
                {project.name}
              </Text>
            </Card.Section>

            <Text td="underline" fw={400} size="lg" mt="md">
              Priority: {project.prio}
            </Text>

            <Text fw={200} size="lg" mt="md">
              {project.detail}
            </Text>

            <Text mt="xs" c="dimmed" size="sm">
              Start: {project.start.toString().slice(0, 10)}
            </Text>
            {project.tasks.length ? (
              <>
                <Text mt="xs" c="dimmed" size="sm">
                  Total time:{' '}
                  {project.skills.map((skill) => skill.time).reduce((acc, time) => acc + time, 0)}{' '}
                  Hours
                </Text>
              </>
            ) : (
              <></>
            )}
          </Card>
        </div>
        {project.tasks.length ? (
          <>
            <div className="donut">
              <Text className="skillset-text" fz="md" mb="sm" ta="center">
                Skillsets Necessary
              </Text>
              <DonutChart
                mx="auto"
                withTooltip={false}
                h={300}
                w={300}
                key={`chart-${project.name}`}
                paddingAngle={9}
                data={project.skills.map((skill) => ({
                  name: skill.name,
                  value: skill.time,
                  color: generateColorRGB(skill.name, colorOptions),
                }))}
              />
            </div>
            <div className="donut-table">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Color</Table.Th>
                    <Table.Th>Skill</Table.Th>
                    <Table.Th>Time(Hours)</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {project.skills.map((skill) => (
                    <Table.Tr key={skill.name}>
                      <Table.Td>
                        {' '}
                        <ColorSwatch color={generateColorRGB(skill.name, colorOptions)} />
                      </Table.Td>
                      <Table.Td>{skill.name}</Table.Td>
                      <Table.Td>{skill.time}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </>
        ) : (
          <>
            <div className="donut">{''}</div>
            <div className="donut-table"></div>
          </>
        )}
      </Flex>
      <Flex
        mih={50}
        gap="md"
        justify="flex-start"
        align="center"
        direction="row"
        wrap="wrap"
        className="card-buttons"
      >
        <Button onClick={openTM} variant="outline" size="md" radius="lg">
          Task Manager
        </Button>
        <Button onClick={() => handleEditProject(project.id)} variant="outline" size="md" radius="lg">
          Edit Project
        </Button>
      </Flex>

      <Space h="md" />

      {projects.length - 1 !== i ? (
        <>
          <Divider />
          <Space h="md" />
        </>
      ) : null}
    </Fragment>
  ));

  return (
    <>
      <Modal size="lg" opened={openedNP} onClose={closeNP} title="New Project">
        <ProjectForm projectId = {0} onAddProject={handleAddProject} editProject={false} />
      </Modal>

      <Modal size="lg" opened={openedTM} onClose={closeTM} title="Task Manager">
        Task Manager
      </Modal>

      <Modal size="lg"  opened={openedEP} onClose={closeEP} title="Edit Project">
        <ProjectForm projectId = {editProject} onAddProject={handleAddProject} editProject={true} />
      </Modal>

      <div>
        <Button onClick={openNP} variant="outline" size="md" radius="lg">
          Create New Project
        </Button>
      </div>
      <Space h="md" />
      <div className="projects">{cards}</div>
    </>
  );
};
