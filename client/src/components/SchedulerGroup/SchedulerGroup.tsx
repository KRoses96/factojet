import '@mobiscroll/react/dist/css/mobiscroll.min.css';
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

const colorOptions = { saturation: 50, lightness: 75, alpha: 100 };

setOptions({
  theme: 'windows',
  themeVariant: 'dark',
});

const ScheduleGroup: FC = () => {
  const [myEvents, setEvents] = useState<MbscCalendarEvent[]>([]);
  const [myResources, setResources] = useState<MbscResource[]>([]);
  const [activeResourceIds, setActiveResourceIds] = useState<Set<number>>(new Set());

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
    []
  );

  const filter = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const resourceId = parseInt(ev.target.value, 10);
      setActiveResourceIds(prev => {
        const newSet = new Set(prev);
        if (ev.target.checked) {
          newSet.add(resourceId);
        } else {
          newSet.delete(resourceId);
        }
        return newSet;
      });
    },
    []
  );

  const filteredResources = useMemo(() => {
    return myResources.filter(r => activeResourceIds.has(typeof r.id === 'number'? r.id : 0));
  }, [myResources, activeResourceIds]);

  useEffect(() => {
    getJson(
      'http://localhost:3000/people',
      (resources) => {
        let resourceArr: MbscResource[] = resources.map((resource: { name: string; id: number }) => ({
          id: resource.id,
          name: resource.name,
          color: generateColorRGB(resource.name, colorOptions),
        })).filter((r : {name: string; id:number}) => r.name && r.id);
        
        setResources(resourceArr);
        setActiveResourceIds(new Set(resourceArr.map(r => typeof r.id === 'number'? r.id : 0)));
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
  }, []);

  return (
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
                  checked={activeResourceIds.has(typeof resource.id === 'number'? resource.id : 0)}
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
  );
};

export default ScheduleGroup;