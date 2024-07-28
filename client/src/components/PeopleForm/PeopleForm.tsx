import { useState } from 'react';
import { Button, Code, Text, TextInput, TagsInput, Space, Radio, Group } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';

type FormPerson = {
  name: string;
  tags: string[];
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

type PeopleFormProps = {
  onAddPerson: () => void;
};

export const PeopleForm = ({ onAddPerson }: PeopleFormProps) => {
  const form = useForm({
    initialValues: {
      name: '',
      tags: [],
      monday: 'fullTime',
      tuesday: 'fullTime',
      wednesday: 'fullTime',
      thursday: 'fullTime',
      friday: 'fullTime',
      saturday: 'dayOff',
      sunday: 'dayOff',
    },
    validate: {
      name: hasLength({ min: 3 }, 'Must be at least 3 characters'),
    },
  });

  const [submittedValues, setSubmittedValues] = useState<FormPerson | null>(null);
  

  const typeSchedules = {
    fullTime: [8, 18],
    morningShift: [8, 13],
    afternoonShift: [14, 18],
    dayOff: [0, 0],
  };

  const skillNameCleaner = (string: string) => {
    return string.trim().split(' ').join('-').toLowerCase()
  }

  const handleSubmit = (values: FormPerson) => {
    setSubmittedValues(values);
    const url = 'http://localhost:3000/';
    fetch(url + 'people', {
      method: 'POST',
      body: JSON.stringify({
        personName: values.name,
        availability: {
          monday_start: typeSchedules[values.monday as keyof typeof typeSchedules][0],
          monday_end: typeSchedules[values.monday as keyof typeof typeSchedules][1],
          tuesday_start: typeSchedules[values.tuesday as keyof typeof typeSchedules][0],
          tuesday_end: typeSchedules[values.tuesday as keyof typeof typeSchedules][1],
          wednesday_start: typeSchedules[values.wednesday as keyof typeof typeSchedules][0],
          wednesday_end: typeSchedules[values.wednesday as keyof typeof typeSchedules][1],
          thursday_start: typeSchedules[values.thursday as keyof typeof typeSchedules][0],
          thursday_end: typeSchedules[values.thursday as keyof typeof typeSchedules][1],
          friday_start: typeSchedules[values.friday as keyof typeof typeSchedules][0],
          friday_end: typeSchedules[values.friday as keyof typeof typeSchedules][1],
          saturday_start: typeSchedules[values.saturday as keyof typeof typeSchedules][0],
          saturday_end: typeSchedules[values.saturday as keyof typeof typeSchedules][1],
          sunday_start: typeSchedules[values.sunday as keyof typeof typeSchedules][0],
          sunday_end: typeSchedules[values.sunday as keyof typeof typeSchedules][1],
        },
        skills: values.tags.map((tag) => skillNameCleaner(tag))
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then(() => 
      onAddPerson())
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput {...form.getInputProps('name')} label="Name" placeholder="Name" />
      <Space h="md" />
      <TagsInput
        {...form.getInputProps('tags')}
        label="Skill Set"
        placeholder="Enter tag"
        clearable
      />

      <Space h="md" />
      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
        <div key={day}>
          <Radio.Group {...form.getInputProps(day)} name={day} label={day.charAt(0).toUpperCase() + day.slice(1)}>
            <Group mt="xs">
              <Radio value="fullTime" label="Full-Time" />
              <Radio value="morningShift" label="Morning-Shift" />
              <Radio value="afternoonShift" label="Afternoon-Shift" />
              <Radio value="dayOff" label="Day-Off" />
            </Group>
          </Radio.Group>
          <Space h="md" />
        </div>
      ))}

      <Button type="submit" mt="md">
        Submit
      </Button>
    </form>
  );
};