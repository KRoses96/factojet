import { useState, useEffect } from 'react';
import {
  Button,
  Text,
  TextInput,
  Space,
  Combobox,
  CheckIcon,
  Group,
  useCombobox,
  Pill,
  PillsInput,
  Flex,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { Task, Skill } from '../TaskManager/TaskManager';
import { Person } from '../PeopleTable/PeopleTable';
import { RespProject } from '../ProjectCards/ProjectCard';

type FormTask = {
  name: string;
  time: number;
  skills: Skill[];
  required: Task[];
};

type TaskFormProps = {
  onAddTask: () => void;
  selectedTask: number | null;
  projectId: number;
};

type MiniTask = {
  name: string;
  id: number;
};

export const TaskForm = ({ onAddTask, selectedTask, projectId }: TaskFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [requiredTasks, setRequiredTasks] = useState<MiniTask[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRequiredTasks, setSelectedRequiredTasks] = useState<MiniTask[]>([]);

  const url = 'http://localhost:3000/';

  const form = useForm({
    initialValues: {
      name: '',
      time: 1,
      skills: [] as Skill[],
      required: [] as Task[],
    },
    validate: {
      name: isNotEmpty('Task must have a name'),
    },
  });

  useEffect(() => {
    const fetchSkills = async () => {
      const response = await fetch(url + 'people', {
        headers: { 'Content-Type': 'application/json' },
      });
      const people: Person[] = await response.json();
      const skillSet = new Set<string>();
      people.forEach((person: Person) =>
        person.skills.forEach((skill) => skillSet.add(skill.name))
      );
      setSkills(Array.from(skillSet));
    };

    const fetchTasks = async () => {
      const response = await fetch(url + `project/${projectId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const project: RespProject = await response.json();
      const tasksToPick = project.tasks.filter((task) => task.id !== selectedTask);
      setRequiredTasks(tasksToPick);
    };

    fetchSkills();
    fetchTasks();
  }, [projectId, selectedTask]);

  useEffect(() => {
    if (selectedTask) {
      setIsLoading(true);
      fetch(url + `task/${selectedTask}`, { headers: { 'Content-Type': 'application/json' } })
        .then((response) => response.json())
        .then((task: Task) => {
          form.setValues({
            name: task.name,
            time: task.time,
            skills: task.skills,
            required: task.required,
          });
          setSelectedSkills(task.skills.map((skill) => skill.name));
          setSelectedRequiredTasks(task.required as MiniTask[]);
        })
        .catch((error) => console.error('Error fetching task data:', error))
        .finally(() => setIsLoading(false));
    }
  }, [selectedTask]);

  const handleSubmit = (values: FormTask) => {
    const methodRequest = selectedTask ? 'PUT' : 'POST';
    const body = {
      projectId : projectId,
      taskId: selectedTask,
      taskName: values.name,
      time: values.time,
      skills: selectedSkills,
      required: selectedRequiredTasks.map((task) => task.id),
    };
    console.log(body)
    
    fetch(url + 'task', {
      method: methodRequest,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }).then(() => onAddTask());
  };

  const handleDelete = () => {
    fetch(url + 'task', {
      method: 'DELETE',
      body: JSON.stringify({
        taskId: selectedTask,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then(() => onAddTask());
  };

  const comboboxSkill = useCombobox({
    onDropdownClose: () => comboboxSkill.resetSelectedOption(),
    onDropdownOpen: () => comboboxSkill.updateSelectedOptionIndex('active'),
  });

  const comboboxTask = useCombobox({
    onDropdownClose: () => comboboxTask.resetSelectedOption(),
    onDropdownOpen: () => comboboxTask.updateSelectedOptionIndex('active'),
  });

  const handleSkillSelect = (skill: string) => {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill]
    );
  };

  const handleTaskSelect = (taskName: string) => {
    const selectedTask = requiredTasks.find((task) => task.name === taskName);
    if (selectedTask) {
      setSelectedRequiredTasks((current) =>
        current.some((t) => t.id === selectedTask.id)
          ? current.filter((t) => t.id !== selectedTask.id)
          : [...current, selectedTask]
      );
    }
  };

  const handleSkillRemove = (skill: string) =>
    setSelectedSkills((current) => current.filter((s) => s !== skill));

  const handleTaskRemove = (task: MiniTask) =>
    setSelectedRequiredTasks((current) => current.filter((t) => t.id !== task.id));

  const skillOptions = skills
    .filter((skill) => skill.toLowerCase().includes(skillSearch.trim().toLowerCase()))
    .map((skill) => (
      <Combobox.Option value={skill} key={skill} active={selectedSkills.includes(skill)}>
        <Group gap="sm">
          {selectedSkills.includes(skill) ? <CheckIcon size={12} /> : null}
          <span>{skill}</span>
        </Group>
      </Combobox.Option>
    ));

  const taskOptions = requiredTasks
    .filter((task) => task.name.toLowerCase().includes(taskSearch.trim().toLowerCase()))
    .map((task) => (
      <Combobox.Option
        value={task.name}
        key={task.id}
        active={selectedRequiredTasks.some((t) => t.id === task.id)}
      >
        <Group gap="sm">
          {selectedRequiredTasks.some((t) => t.id === task.id) ? <CheckIcon size={12} /> : null}
          <span>{task.name}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Flex mih={50} gap="md" justify="center" align="center" direction="row" wrap="wrap">
            <TextInput {...form.getInputProps('name')} label="Name" placeholder="Name" />
            <Space h="md" />
            <TextInput
              {...form.getInputProps('time')}
              type="number"
              label="Time(Hours)"
              placeholder="Time(Hours)"
            />
          </Flex>
          <Space h="md" />
          <Combobox store={comboboxSkill} onOptionSubmit={handleSkillSelect}>
            <Combobox.DropdownTarget>
              <PillsInput onClick={() => comboboxSkill.openDropdown()}>
                <Pill.Group>
                  {selectedSkills.map((skill) => (
                    <Pill key={skill} withRemoveButton onRemove={() => handleSkillRemove(skill)}>
                      {skill}
                    </Pill>
                  ))}
                  <Combobox.EventsTarget>
                    <PillsInput.Field
                      onFocus={() => comboboxSkill.openDropdown()}
                      onBlur={() => comboboxSkill.closeDropdown()}
                      value={skillSearch}
                      placeholder="Search skills"
                      onChange={(event) => {
                        comboboxSkill.updateSelectedOptionIndex();
                        setSkillSearch(event.currentTarget.value);
                      }}
                    />
                  </Combobox.EventsTarget>
                </Pill.Group>
              </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown>
              <Combobox.Options>{skillOptions}</Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>

          <Space h="md" />

          <Combobox store={comboboxTask} onOptionSubmit={handleTaskSelect}>
            <Combobox.DropdownTarget>
              <PillsInput onClick={() => comboboxTask.openDropdown()}>
                <Pill.Group>
                  {selectedRequiredTasks.map((task) => (
                    <Pill key={task.id} withRemoveButton onRemove={() => handleTaskRemove(task)}>
                      {task.name}
                    </Pill>
                  ))}
                  <Combobox.EventsTarget>
                    <PillsInput.Field
                      onFocus={() => comboboxTask.openDropdown()}
                      onBlur={() => comboboxTask.closeDropdown()}
                      value={taskSearch}
                      placeholder="Search tasks"
                      onChange={(event) => {
                        comboboxTask.updateSelectedOptionIndex();
                        setTaskSearch(event.currentTarget.value);
                      }}
                    />
                  </Combobox.EventsTarget>
                </Pill.Group>
              </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown>
              <Combobox.Options>{taskOptions}</Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>

          <Flex mih={50} gap="md" justify="center" align="center" direction="row" wrap="wrap">
            <Button type="submit" mt="md">
              {selectedTask ? 'Save' : 'Add'}
            </Button>

            {selectedTask && (
              <Button onClick={handleDelete} type="button" color="red" mt="md">
                Delete
              </Button>
            )}
          </Flex>
        </>
      )}
    </form>
  );
};
