import { Tabs, rem, Divider, Space } from '@mantine/core';
import { IconCalendarTime, IconHammer, IconMan, IconBackhoe } from '@tabler/icons-react';
import logo from '../factojet.png'
import { PeopleTable } from '@/components/PeopleTable/PeopleTable';
import { ProjectCard } from '@/components/ProjectCards/ProjectCard';
import { useEffect, useState } from 'react';
import { ScheduleGroup } from '@/components/SchedulerGroup/SchedulerGroup';
export const HomePage = () => {
  document.title = 'Factojet'
  const iconStyle = { width: rem(30), height: rem(30) };
  const [currentTab, setCurrentTab] = useState('schedule')

  const handleTabSwitch = (tab: string) => {
    setCurrentTab(tab)
  }




  return (
    <Tabs color="indigo" defaultValue="schedule">
      <img src={logo} alt="Logo" className='logo' />
      <Divider size="sm" />
      <Tabs.List>
        <Tabs.Tab onClick={() => handleTabSwitch("schedule")} value="schedule" leftSection={<IconCalendarTime style={iconStyle} />}>
          Schedule
        </Tabs.Tab>
        <Tabs.Tab onClick={() => handleTabSwitch("projects")} value="projects" leftSection={<IconHammer style={iconStyle} />}>
          Projects
        </Tabs.Tab>
        <Tabs.Tab onClick={() => handleTabSwitch("workers")} value="workers" leftSection={<IconMan style={iconStyle} />}>
          Workers
        </Tabs.Tab>
        <Tabs.Tab onClick={() => handleTabSwitch("equipment")} value="equipment" leftSection={<IconBackhoe style={iconStyle} />}>
          Equipment
        </Tabs.Tab>
      </Tabs.List>
      <div className='inner-content'>

        <Tabs.Panel value="schedule">
          <ScheduleGroup currentTab={currentTab} />
        </Tabs.Panel>

        <Tabs.Panel value="projects">
          <ProjectCard />
        </Tabs.Panel>

        <Tabs.Panel value="workers">
          <PeopleTable />
        </Tabs.Panel>
      </div>
    </Tabs>
  );
};
