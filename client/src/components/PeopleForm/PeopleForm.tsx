import { useState } from 'react';
import { Button, Code, Text, TextInput, TagsInput, Space } from '@mantine/core';
import { hasLength, isEmail, useForm } from '@mantine/form';

export const PeopleForm = () => {
  const form = useForm({
    mode: 'controlled',
    initialValues: { name: '', tags: [] },
    validate: {
      name: hasLength({ min: 3 }, 'Must be at least 3 characters'),
    },
  });

  const [submittedValues, setSubmittedValues] = useState<typeof form.values | null>(null);

  return (
    <form onSubmit={form.onSubmit(setSubmittedValues)}>
      <TextInput {...form.getInputProps('name')} label="Name" placeholder="Name" />
      <Space h='md'/>
      <TagsInput {...form.getInputProps('tags')}
      label="Skill Set"
      placeholder="Enter tag"
      clearable
    />
      <Button type="submit" mt="md">
        Submit
      </Button>
    </form>
  );
}

