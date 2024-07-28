import { useState, useEffect } from 'react';
import { Button, Code, Text, TextInput, Space, Textarea, Slider, Flex } from '@mantine/core';
import { hasLength, isNotEmpty, useForm } from '@mantine/form';
import { Calendar, DatePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import './ProjectForm.css';

type FormProject = {
  name: string;
  details: string;
  start: Date;
  priority: number;
};

type ProjectFormProps = {
  onAddProject: () => void;
  editProject: boolean;
  projectName: string;
};

export const ProjectForm = ({ onAddProject, editProject, projectName }: ProjectFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [submittedValues, setSubmittedValues] = useState<FormProject | null>(null);
  const url = 'http://localhost:3000/project' //Endpoint for all project related changes

  const getProject = () => {
    fetch(url + '/single',{
      body: JSON.stringify({
        projectName: projectName,
      }),
      headers: { 'Content-Type': 'application/json' },})
  }

  const form = useForm<FormProject>({
    initialValues: {
      name: '',
      details: '',
      start: new Date(),
      priority: 50,
    },
    validate: {
      name: isNotEmpty('Projects must have a name'),
      details: isNotEmpty('Projects must have details'),
      start: isNotEmpty('Projects must have a start date'),
    },
  });

  const prioMarks = [
    { value: 0, label: 'Ignore' },
    { value: 25, label: 'Low' },
    { value: 50, label: 'Normal' },
    { value: 75, label: 'High' },
    { value: 100, label: 'Urgent' },
  ];

  //Used to transform the values from marks into proper db values
  const prioRealValues = {
    0: 1,
    25: 2,
    50: 3,
    75: 4,
    100: 5,
  };

  const handleSubmit = (values: FormProject) => {
    const projectData = {
      ...values,
      start: selectedDate || new Date(),
    };
    setSubmittedValues(projectData);
    const methodRequest = editProject ? 'PUT' : 'POST';
    fetch(url ,{
      method: methodRequest,
      body: JSON.stringify({
        projectName: projectData.name,
        projectStart: projectData.start,
        projectPriority: projectData.priority,
        projectDetail: projectData.details,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then(() => onAddProject());
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput {...form.getInputProps('name')} label="Name" placeholder="Name" />
      <Space h="md" />
      <Textarea
        {...form.getInputProps('details')}
        label="Details"
        description="Project details"
        placeholder="Input project details"
      />
      <Space h="md" />
      <Text> Priority: </Text>
      <Space h="md" />
      <Slider
        {...form.getInputProps('priority')}
        label={(val) => prioMarks.find((mark) => mark.value === val)?.label}
        step={25}
        marks={prioMarks}
        styles={{ markLabel: { display: 'none' } }}
      />
      <Space h="md" />
      <Text>Starting Date:</Text>
      <Flex mih={50} gap="md" justify="center" align="center" direction="column" wrap="wrap">
        <DatePicker
          {...form.getInputProps('start')}
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </Flex>
      <Flex mih={50} gap="md" justify="center" align="center" direction="row" wrap="wrap">
        <Button type="submit" mt="md">
          Submit
        </Button>
        {editProject ? (
          <>
            <Button color="red" mt="md">
              Delete Project
            </Button>
          </>
        ) : null}
      </Flex>
      {submittedValues && (
        <Text mt="md">
          Submitted values: <Code block>{JSON.stringify(submittedValues, null, 2)}</Code>
        </Text>
      )}
    </form>
  );
};
