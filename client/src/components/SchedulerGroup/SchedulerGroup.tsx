import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import './SchedulerGroup.css';
import {
  Eventcalendar,
  getJson,
  MbscCalendarEvent,
  MbscEventcalendarView,
  MbscResource,
  setOptions,
  Page,
  Checkbox,
} from '@mobiscroll/react';
import { FC, useEffect, useMemo, useState, ChangeEvent, useCallback } from 'react';
import { generateColorRGB } from '@marko19907/string-to-color';
import { Space, Divider, Title, Text, Flex, Table, ColorSwatch } from '@mantine/core';
import { DonutChart } from '@mantine/charts';
import '@mantine/charts/styles.css';

const colorOptions = { saturation: 45, lightness: 55, alpha: 100 };

setOptions({
  theme: 'windows',
  themeVariant: 'dark',
});


const optionsDate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

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


const ScheduleGroup= ({currentTab}: {currentTab: string}) => {
  const [myEvents, setEvents] = useState<MbscCalendarEvent[]>([]);
  const [myResources, setResources] = useState<MbscResource[]>([]);
  const [activeResourceIds, setActiveResourceIds] = useState<Set<number>>(new Set());
  const [workedTimeData, setWorkedTimeData] = useState<
    { name: string; value: number; color: string }[]
  >([]);

  const [projects, setProjects] = useState<RespProject[]>([]);

  const myView = useMemo<MbscEventcalendarView>(
    () => ({
      schedule: {
        type: 'day',
        allDay: false,
        startDay: 0,
        endDay: 6,
        startTime: '07:00',
        endTime: '20:00',
      },
    }),
    []
  );

  const processWorkedTimeData = useCallback(() => {
    const workedTime: { [key: string]: number } = {};

    myEvents.forEach((event: MbscCalendarEvent) => {
      if (
        event.resource &&
        event.start &&
        event.end &&
        typeof event.start !== 'object' &&
        typeof event.end !== 'object'
      ) {
        const resourceId = event.resource;
        const resource = myResources.find((r) => r.id === resourceId);
        if (resource) {
          const start = new Date(event.start);
          const end = new Date(event.end);
          const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Duration in hours
          workedTime[resource.name as keyof typeof workedTime] =
            (workedTime[resource.name as keyof typeof workedTime] || 0) + duration;
        }
      }
    });

    const newWorkedTimeData = Object.entries(workedTime).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)), // Round to 2 decimal places
      color: generateColorRGB(name, colorOptions),
    }));

    setWorkedTimeData(newWorkedTimeData.sort((a,b) => b.value-a.value));
  }, [myEvents, myResources]);

  const filter = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const resourceId = parseInt(ev.target.value, 10);
    setActiveResourceIds((prev) => {
      const newSet = new Set(prev);
      if (ev.target.checked) {
        newSet.add(resourceId);
      } else {
        newSet.delete(resourceId);
      }
      return newSet;
    });
  }, []);

  const filteredResources = useMemo(() => {
    return myResources.filter((r) => activeResourceIds.has(typeof r.id === 'number' ? r.id : 0));
  }, [myResources, activeResourceIds]);

  useEffect(() => {
    const url = 'http://localhost:3000/project';
    processWorkedTimeData();
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) => setProjects(data));
  }, [myEvents, myResources, processWorkedTimeData]);

  useEffect(() => {
    getJson(
      'http://localhost:3000/people',
      (resources) => {
        let resourceArr: MbscResource[] = resources
          .map((resource: { name: string; id: number }) => ({
            id: resource.id,
            name: resource.name,
            color: generateColorRGB(resource.name, colorOptions),
          }))
          .filter((resource: { name: string; id: number }) => resource.name && resource.id);

        setResources(resourceArr);
        setActiveResourceIds(
          new Set(
            resourceArr.map((resource) => (typeof resource.id === 'number' ? resource.id : 0))
          )
        );
      },
      'json'
    );

    getJson(
      'http://localhost:3000/solution',
      (events) => {
        setEvents(events);
      },
      'json'
    );
  }, [currentTab ]);

  return (
    <>
      <Page>
        <div className="mbsc-grid mbsc-no-padding">
          <div className="mbsc-row">
            <div className="mbsc-col-sm-9">
              <Eventcalendar
                dragToMove={true}
                dragToResize={true}
                view={myView}
                data={myEvents}
                resources={filteredResources}
              />
            </div>
            <div className="mbsc-col-sm-3">
              <div className="mbsc-form-group-title">Workers</div>
              <div>
                {myResources.map((resource) => (
                  <Checkbox
                    checked={activeResourceIds.has(
                      typeof resource.id === 'number' ? resource.id : 0
                    )}
                    onChange={filter}
                    value={resource.id.toString()}
                    label={resource.name}
                    key={resource.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Page>
      <Space h="md" />
      <Divider size="sm" />
      <Space h="md" />
      <div className="report-body">
        <div className="report">
          <Title className="" td="underline" order={1}>
            Solution Report
          </Title>
        </div>
        <Space h="xl" />
        <Flex mih={50} gap="md" justify="left" align="center" direction="row" wrap="nowrap">
          <div className="project-table">
            <Table striped withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Project</Table.Th>
                  <Table.Th>Total Hours</Table.Th>
                  <Table.Th>Estimated Completion</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {projects.map((project) => {
                  const projectEvents = myEvents.filter(
                    (event) =>
                      event.title && event.title.split('-')[0].trim() === project.name.trim()
                  );
                  const latestEndDate = projectEvents.reduce((latest, event) => {
                    if (event.end && typeof event.end !== 'object') {
                      const endDate = new Date(event.end);
                      return endDate > latest ? endDate : latest;
                    }
                    return latest;
                  }, new Date(0));

                  return (
                    <Table.Tr key={project.name}>
                      <Table.Td>{project.name}</Table.Td>
                      <Table.Td>{project.tasks.reduce((ac, task) => ac + task.time, 0)}</Table.Td>
                      <Table.Td>
                        {latestEndDate.getTime() > 0
                          ? latestEndDate.toLocaleDateString('en-US', optionsDate)
                          : 'N/A'}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
          <Divider orientation="vertical" />
          <div className="donut">
            <Text className="skillset-text" fz="xl" mb="xs" ta="center">
              Work Distribution
            </Text>
            <DonutChart
              mx="auto"
              h={300}
              w={300}
              size={230}
              key={JSON.stringify(workedTimeData)}
              paddingAngle={9}
              data={workedTimeData}
              tooltipDataSource="segment"
            />
          </div>

          <div className="donut-table">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Color</Table.Th>
                  <Table.Th>Worker</Table.Th>
                  <Table.Th>Time(Hours)</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {workedTimeData.map((person) => (
                  <Table.Tr key={person.name}>
                    <Table.Td>
                      {' '}
                      <ColorSwatch color={generateColorRGB(person.name, colorOptions)} />
                    </Table.Td>
                    <Table.Td>{person.name}</Table.Td>
                    <Table.Td>{person.value}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </Flex>
      </div>
    </>
  );
};

export default ScheduleGroup;
