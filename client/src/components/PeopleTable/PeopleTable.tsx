import { useState, useEffect, Fragment } from 'react';
import { Table, Badge, rem, Modal, Button, Space } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { PeopleForm } from '../PeopleForm/PeopleForm';
import { generateColorRGB } from '@marko19907/string-to-color';

const colorOptions = { saturation: 50, lightness: 55, alpha: 80 };

export type Person = {
  id: number;
  name: string;
  skills: Skill[];
};

export type RespAvailability = {
  id: number;
  person: Person;
  monday_start: number;
  monday_end: number;
  tuesday_start: number;
  tuesday_end: number;
  wednesday_start: number;
  wednesday_end: number;
  thursday_start: number;
  thursday_end: number;
  friday_start: number;
  friday_end: number;
  saturday_start: number;
  saturday_end: number;
  sunday_start: number;
  sunday_end: number;
};

type Skill = {
  id: number;
  name: string;
};

type WeekAvailability = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

type People = {
  id: number;
  name: string;
  skills: string[];
  weekAvailability: WeekAvailability;
};

export const PeopleTable = () => {
  const iconStyle = { width: rem(30), height: rem(30) };

  const [people, setPeople] = useState<People[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);

  const handleAddPerson = () => {
    getAllPeople();
    handleCloseModal();
  };

  const handleRowClick = (personId: number) => {
    setSelectedPerson(personId);
    open();
  };

  const handleCloseModal = () => {
    close();
    setSelectedPerson(null);
  };

  const getAllPeople = () => {
    const url = 'http://localhost:3000/avaliability';
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) =>
        setPeople(
          data.map((person: RespAvailability) => ({
            id: person.person.id,
            name: person.person.name,
            skills: person.person.skills.map((skill) => skill.name),
            weekAvailability: {
              monday: person.monday_start && person.monday_end ,
              tuesday: person.tuesday_start && person.tuesday_end,
              wednesday: person.wednesday_start && person.wednesday_end ,
              thursday: person.thursday_start && person.thursday_end ,
              friday: person.friday_start && person.friday_end ,
              saturday: person.saturday_start && person.saturday_end ,
              sunday: person.sunday_start && person.sunday_end,
            },
          }))
        )
      )
      .catch((error) => console.error('Error fetching data:', error));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
      //Pooling in case multiple people are managing
      setTimeout(getAllPeople, 5000);
  }, []);

  const ths = (
    <Table.Tr>
      <Table.Th>Name</Table.Th>
      <Table.Th>Skill Set</Table.Th>
      <Table.Th>Mon</Table.Th>
      <Table.Th>Tue</Table.Th>
      <Table.Th>Wed</Table.Th>
      <Table.Th>Thu</Table.Th>
      <Table.Th>Fri</Table.Th>
      <Table.Th>Sat</Table.Th>
      <Table.Th>Sun</Table.Th>
    </Table.Tr>
  );

  const rows = people
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    .map((person) => (
      <Table.Tr onClick={() => handleRowClick(person.id)} key={person.id}>
        <Table.Td>{person.name}</Table.Td>
        <Table.Td>
          {person.skills.map((skill) => (
            <Fragment key={skill}>
              <Badge className="skills" color={generateColorRGB(skill, colorOptions)}>
                {skill}
              </Badge>
              <span> </span>
            </Fragment>
          ))}
        </Table.Td>
        <Table.Td>
          {person.weekAvailability.monday ? (
            <IconCheck style={iconStyle} />
          ) : (
            <IconX style={iconStyle} />
          )}{' '}
        </Table.Td>
        <Table.Td>
          {person.weekAvailability.tuesday ? (
            <IconCheck style={iconStyle} />
          ) : (
            <IconX style={iconStyle} />
          )}{' '}
        </Table.Td>
        <Table.Td>
          {person.weekAvailability.wednesday ? (
            <IconCheck style={iconStyle} />
          ) : (
            <IconX style={iconStyle} />
          )}{' '}
        </Table.Td>
        <Table.Td>
          {person.weekAvailability.thursday ? (
            <IconCheck style={iconStyle} />
          ) : (
            <IconX style={iconStyle} />
          )}{' '}
        </Table.Td>
        <Table.Td>
          {person.weekAvailability.friday ? (
            <IconCheck style={iconStyle} />
          ) : (
            <IconX style={iconStyle} />
          )}{' '}
        </Table.Td>
        <Table.Td>
          {person.weekAvailability.saturday ? (
            <IconCheck style={iconStyle} />
          ) : (
            <IconX style={iconStyle} />
          )}{' '}
        </Table.Td>
        <Table.Td>
          {person.weekAvailability.sunday ? (
            <IconCheck style={iconStyle} />
          ) : (
            <IconX style={iconStyle} />
          )}{' '}
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <>
      <Modal
        size="lg"
        opened={opened}
        onClose={handleCloseModal}
        title={selectedPerson ? 'Edit Worker' : 'New Worker'}
      >
        <PeopleForm selectedPerson={selectedPerson} onAddPerson={handleAddPerson} />
      </Modal>

      <Button onClick={open} variant="outline" size="md" radius="lg">
        Add New Worker
      </Button>

      <Space h="md" />

      <div className="worker-table">
        <Table
          stickyHeader
          stickyHeaderOffset={60}
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
        >
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
    </>
  );
};
