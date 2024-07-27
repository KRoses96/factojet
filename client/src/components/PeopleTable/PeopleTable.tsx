import { useState, useEffect } from 'react';
import { Table, Badge, rem, Modal, Button, Space } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { PeopleForm } from '../PeopleForm/PeopleForm';



type Person = {
  id: number;
  name: string;
  skills: Skill[]
};

type RespAvaliability = {
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
  name: string;
};

type WeekAvaliability = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

type People = {
  name: string;
  skills: string[];
  weekAvaliability: WeekAvaliability;
};

export const PeopleTable = () => {

  const iconStyle = { width: rem(30), height: rem(30) };

  const [people, setPeople] = useState<People[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const url = 'http://localhost:3000/avaliability';
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) =>
        setPeople(
          data.map((person: RespAvaliability) => ({
            name: person.person.name,
            skills: person.person.skills.map((skill) => skill.name),
            weekAvaliability: {
              monday: person.monday_start && person.monday_end ? true : false,
              tuesday: person.tuesday_start && person.tuesday_end ? true : false,
              wednesday: person.wednesday_start && person.wednesday_end ? true : false,
              thursday: person.thursday_start && person.thursday_end ? true : false,
              friday: person.friday_start && person.friday_end ? true : false,
              saturday: person.saturday_start && person.saturday_end ? true : false,
              sunday: person.sunday_start && person.sunday_end ? true : false
            }
          }))
        )
      )
      .catch((error) => console.error('Error fetching data:', error));
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


  const rows = people.map((person) => (
    <Table.Tr key={person.name}>
      <Table.Td>{person.name}</Table.Td>
      <Table.Td>{person.skills.map((skill) => <> <Badge className='skills' key={skill} color='blue'>{skill}</Badge> <span></span> </> )}</Table.Td>
      <Table.Td>{person.weekAvaliability.monday? <IconCheck style={iconStyle} /> :  <IconX style={iconStyle} />} </Table.Td>
      <Table.Td>{person.weekAvaliability.tuesday? <IconCheck style={iconStyle} /> :  <IconX style={iconStyle} />} </Table.Td>
      <Table.Td>{person.weekAvaliability.wednesday? <IconCheck style={iconStyle} /> :  <IconX style={iconStyle} />} </Table.Td>
      <Table.Td>{person.weekAvaliability.thursday? <IconCheck style={iconStyle} /> :  <IconX style={iconStyle} />} </Table.Td>
      <Table.Td>{person.weekAvaliability.friday? <IconCheck style={iconStyle} /> :  <IconX style={iconStyle} />} </Table.Td>
      <Table.Td>{person.weekAvaliability.saturday? <IconCheck style={iconStyle} /> :  <IconX style={iconStyle} />} </Table.Td>
      <Table.Td>{person.weekAvaliability.sunday? <IconCheck style={iconStyle} /> :  <IconX style={iconStyle} />} </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
    <Modal opened={opened} onClose={close} title="New Worker">
      <PeopleForm/>
    </Modal>

    <Button onClick={open} variant="outline" size="md" radius="lg">Add New Worker</Button>

    <Space h='md'/>

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
