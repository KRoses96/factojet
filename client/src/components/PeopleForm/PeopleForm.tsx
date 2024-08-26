import { useState, useEffect } from 'react';
import { Button, Text, TextInput, TagsInput, Space, Radio, Group } from '@mantine/core';
import { hasLength, isNotEmpty, useForm } from '@mantine/form';
import type { RespAvailability } from '../PeopleTable/PeopleTable';

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
  selectedPerson: number | null;
};

export const PeopleForm = ({ onAddPerson, selectedPerson }: PeopleFormProps) => {
  const [_, setSubmittedValues] = useState<FormPerson | null>(null);
  const [personData, setPersonData] = useState<FormPerson>({
    name: '',
    tags: [],
    monday: 'fullTime',
    tuesday: 'fullTime',
    wednesday: 'fullTime',
    thursday: 'fullTime',
    friday: 'fullTime',
    saturday: 'dayOff',
    sunday: 'dayOff',
  });
  const [isLoading, setIsLoading] = useState(false);

  const url = 'http://localhost:3000/people';

  const form = useForm({
    initialValues: personData,
    validate: {
      name: isNotEmpty('Workers must have a name')
    },
  });

  const typeSchedules = {
    fullTime: [8, 18],
    morningShift: [8, 13],
    afternoonShift: [14, 18],
    dayOff: [0, 0],
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (selectedPerson) {
      setIsLoading(true);
      fetch(`${url}/${selectedPerson}`, {
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((person: RespAvailability) => {
          const mapShift = (start: number, end: number) => {
            if (start === 8 && end === 18) return 'fullTime';
            if (start === 8 && end === 13) return 'morningShift';
            if (start === 14 && end === 18) return 'afternoonShift';
            return 'dayOff';
          };

          const newPersonData = {
            name: person.person.name,
            tags: person.person.skills.map((skill) => skill.name),
            monday: mapShift(person.monday_start, person.monday_end),
            tuesday: mapShift(person.tuesday_start, person.tuesday_end),
            wednesday: mapShift(person.wednesday_start, person.wednesday_end),
            thursday: mapShift(person.thursday_start, person.thursday_end),
            friday: mapShift(person.friday_start, person.friday_end),
            saturday: mapShift(person.saturday_start, person.saturday_end),
            sunday: mapShift(person.sunday_start, person.sunday_end),
          };

          setPersonData(newPersonData);
          form.setValues(newPersonData);
        })
        .catch((error) => {
          console.error('Error fetching person data:', error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedPerson]);

  const skillNameCleaner = (string: string) => {
    return string.trim().split(' ').join('-').toLowerCase();
  };

  const handleSubmit = (values: FormPerson) => {
    setSubmittedValues(values);
    const methodRequest = selectedPerson? 'PUT' : 'POST'
    fetch(url, {
      method: methodRequest,
      body: JSON.stringify({
        personId: selectedPerson,
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
        skills: values.tags.map((tag) => skillNameCleaner(tag)),
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then(() => onAddPerson());
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <TextInput {...form.getInputProps('name')} label="Name" placeholder="Name" />
          <Space h="md" />
          <TagsInput
            {...form.getInputProps('tags')}
            label="Skill Set"
            placeholder="Enter tag"
            clearable
          />

          <Space h="md" />
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
            (day) => (
              <div key={day}>
                <Radio.Group
                  {...form.getInputProps(day)}
                  name={day}
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                >
                  <Group mt="xs">
                    <Radio value="fullTime" label="Full-Time" />
                    <Radio value="morningShift" label="Morning-Shift" />
                    <Radio value="afternoonShift" label="Afternoon-Shift" />
                    <Radio value="dayOff" label="Day-Off" />
                  </Group>
                </Radio.Group>
                <Space h="md" />
              </div>
            )
          )}

          <Button type="submit" mt="md">
            {selectedPerson? (<>Save</>) : (<>Add</>)}
          </Button>
        </>
      )}
    </form>
  );
};
