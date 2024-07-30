import { useState, useEffect, useRef } from 'react';
import { Button, Code, Text, TextInput, Space, Textarea, Slider, Flex, Image, Center } from '@mantine/core';
import { hasLength, isNotEmpty, useForm } from '@mantine/form';
import { Calendar, DatePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import './ProjectForm.css';

type FormProject = {
  name: string;
  details: string;
  start: Date;
  priority: number;
  image: string;
};

type ProjectFormProps = {
  onAddProject: () => void;
  editProject: boolean;
  projectId: number;
};

type ResponseProject = {
  id: string;
  name: string;
  start_date: Date;
  details: string;
  priority: number;
  image: string;
};

export const ProjectForm = ({ onAddProject, editProject, projectId }: ProjectFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [submittedValues, setSubmittedValues] = useState<FormProject | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const url = 'http://localhost:3000/project'; //Endpoint for all project related changes

  const [projectData, setProjectData] = useState<FormProject>({
    name: '',
    details: '',
    start: new Date(),
    priority: 50,
    image: '',
  });

  const getProject = () => {
    return fetch(url + `/${projectId}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((project: ResponseProject) => {
        console.log(project)
        setProjectData({
          name: project.name,
          details: project.details,
          start: new Date(project.start_date),
          priority: project.priority,
          image: project.image
        });
        setSelectedDate(new Date(project.start_date));
        setImagePreview(project.image);
        console.log(projectData)
      });
  };

  useEffect(() => {
    if (editProject && projectId) {
      getProject();
    }
  }, [editProject, projectId]);

  const form = useForm<FormProject>({
    initialValues: projectData,
    validate: {
      name: isNotEmpty('Projects must have a name'),
      details: isNotEmpty('Projects must have details'),
      start: isNotEmpty('Projects must have a start date'),
    },
  });

  useEffect(() => {
    if (projectData.name !== undefined && projectData.details !== undefined && 
        projectData.start !== undefined && projectData.priority !== undefined) {
      form.setValues(projectData);
    }
  }, [projectData]);

  useEffect(() => {
    setSelectedDate(projectData.start);
  }, [projectData.start]);

  const prioMarks = [
    { value: 0, label: 'Ignore' },
    { value: 25, label: 'Low' },
    { value: 50, label: 'Normal' },
    { value: 75, label: 'High' },
    { value: 100, label: 'Urgent' },
  ];

  const handleDelete = () => {
    fetch( url + `/${projectId}`, {
      method: 'DELETE',
    }).then(() => onAddProject())
  }

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'kwowldyl');
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dksp40fgp/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        form.setFieldValue('image', imageUrl);
        setImagePreview(imageUrl);
      }
    }
  };

  const handleSubmit = async (values: FormProject) => {
    const projectData = {
      ...values,
      start: selectedDate,
    };
    setSubmittedValues(projectData);
    const methodRequest = editProject ? 'PUT' : 'POST';
    fetch(url, {
      method: methodRequest,
      body: JSON.stringify({
        projectId: projectId,
        projectName: projectData.name,
        projectStart: projectData.start,
        projectPriority: projectData.priority,
        projectDetail: projectData.details,
        projectImage: projectData.image
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
        autosize
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
          onChange={(date) => setSelectedDate(date || new Date())}
        />
      </Flex>
      <Space h='md'/>
      <Center>
      <Button onClick={() => fileInputRef.current?.click()}>
        Upload Image
      </Button>
      </Center>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageUpload}
        accept="image/*"
      />
      {imagePreview && (
        <>
        <Text>
          Preview:
        </Text>
        <Image src={imagePreview} alt="Project Image" width={200} />
        </>
      )}
      <Space h='md'/>
      <Flex mih={50} gap="md" justify="center" align="center" direction="row" wrap="wrap">
        <Button type="submit" mt="md">
          {editProject? (<>Save</>) : (<>Create New Project</>)}
        </Button>
        {editProject ? (
          <>
            <Button type='button' onClick={handleDelete} color="red" mt="md">
              Delete
            </Button>
          </>
        ) : null}
      </Flex>
    </form>
  );
};