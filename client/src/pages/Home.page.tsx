import ScheduleGroup from '@/components/SchedulerGroup/SchedulerGroup';
import { Tabs, rem, Divider, Space } from '@mantine/core';
import { IconCalendarTime, IconHammer, IconMan, IconBackhoe } from '@tabler/icons-react';
import logo from '../factojet.png'
import { PeopleTable } from '@/components/PeopleTable/PeopleTable';
import { ProjectCard } from '@/components/ProjectCards/ProjectCard';
export const HomePage = () => {
  const iconStyle = { width: rem(30), height: rem(30) };

  return (
    <Tabs color="indigo" defaultValue="schedule">
      <img src={logo} alt="Logo" className='logo' />
      <Divider size="sm" />
      <Tabs.List>
        <Tabs.Tab value="schedule" leftSection={<IconCalendarTime style={iconStyle} />}>
          Schedule
        </Tabs.Tab>
        <Tabs.Tab value="projects" leftSection={<IconHammer style={iconStyle} />}>
          Projects
        </Tabs.Tab>
        <Tabs.Tab value="workers" leftSection={<IconMan style={iconStyle} />}>
          Workers
        </Tabs.Tab>
        <Tabs.Tab value="equipment" leftSection={<IconBackhoe style={iconStyle} />}>
          Equipment
        </Tabs.Tab>
      </Tabs.List>
      <div className='inner-content'>

      <Tabs.Panel value="schedule">
        <ScheduleGroup/>
      </Tabs.Panel>

      <Tabs.Panel value="projects">
        <ProjectCard/>
      </Tabs.Panel>

      <Tabs.Panel value="workers">
        <PeopleTable/>
      </Tabs.Panel>
      </div>
    </Tabs>
  );
};
