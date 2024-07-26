import { Table } from '@mantine/core';

export const PeopleTable =() =>  {

  const ths = (
    <Table.Tr>
      <Table.Th>Element position</Table.Th>
      <Table.Th>Element name</Table.Th>
      <Table.Th>Symbol</Table.Th>
      <Table.Th>Atomic mass</Table.Th>
    </Table.Tr>
  );

  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <Table.Caption>Workers</Table.Caption>
      <Table.Thead>{ths}</Table.Thead>
    </Table>
  );
}