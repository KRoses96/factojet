import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import {
  Eventcalendar,
  getJson,
  MbscCalendarEvent,
  MbscEventcalendarView,
  MbscResource,
  setOptions,
  MbscEventCreateEvent
} from '@mobiscroll/react';
import { FC, useEffect, useMemo, useState } from 'react';
import { Button } from '@mantine/core';
import { generateColorRGB } from "@marko19907/string-to-color";

const colorOptions = { saturation: 50, lightness: 75, alpha: 100 };


setOptions({
  theme: 'ios',
  themeVariant: 'light',
});

const ScheduleGroup: FC = () => {
  const [myEvents, setEvents] = useState<MbscCalendarEvent[]>([]);
  const [myResources, setResources] =useState<MbscResource[]>([]);
  const myView = useMemo<MbscEventcalendarView>(
    () => ({
      schedule: {
        type: 'week',
        allDay: false,
        startDay: 1,
        endDay: 7,
        startTime: '07:00',
        endTime: '20:00',
      },
    }),
    [],
  );

    useEffect(() => {

      getJson(
        'http://localhost:3000/people',
        (resources) => {
          let resourceArr : MbscResource[] = []
          resources.map((resource:{name:string, id:number}) => {
            if (resource.name && resource.id) {
            resourceArr.push({id:resource.id,name:resource.name,color:generateColorRGB(resource.name,colorOptions)})
          }
          }
        )
        setResources(resourceArr)
        
        },
        'json',
      );

      getJson(
        'http://localhost:3000/solution',
        (events) => {
          setEvents(events);
        },
        'json',
      );
    }, []);

    const printEvents = () => {
      console.log(myEvents)
      console.log(myResources)
    }
  return (
    <>
    <Eventcalendar
      dragToMove={true}
      dragToResize={true}
      eventDelete={true}
      clickToCreate = {true}
      view={myView}
      data={myEvents}
      resources={myResources}
    />
    <Button onClick={printEvents} variant="filled">Button</Button>;
    </>
  );
};
export default ScheduleGroup;