import pako from 'pako';
import { Buffer } from 'buffer';
import { Stack } from '@fluentui/react';
import { addBusinessDays, isAfter, isBefore, isPast, isFuture, startOfDay, endOfDay } from 'date-fns'

interface Module {
  ID: string,
  ModuleID: string,
  Name: string,
}

interface Course {
  ID: string,
  ModuleID: string,
  LongName: string,
  Type: string,
}

interface Event {
  CourseID: string,
  Start: string,
  End: string,
  RoomID: string,
  RoomName: string,
}

interface Room {
  RoomID: string,
  RoomLatitude: number,
  RoomLongitude: number,
}

interface CurrentEvent {
  EventTable: JSX.Element,
  RoomLatitude: number,
  RoomLongitude: number,
}

const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

export class CourseStorage {
  private indexAvaliable: boolean;
  private modules: { [id: string]: Module };
  private courses: { [id: string]: Course };
  private events: Event[];
  private rooms: { [id: string]: Room };

  //TODO: singleton
  constructor() {
    var indexData = localStorage.getItem('index-data');
    this.indexAvaliable = indexData !== null;

    if (indexData !== null) {
      var data = Buffer.from(indexData, 'base64')
      var indexObject = JSON.parse(pako.ungzip(data, { to: 'string' }))

      this.modules = indexObject.modules;
      this.courses = indexObject.courses;
      this.events = indexObject.events;
      this.rooms = indexObject.rooms;
    } else {
      this.modules = {};
      this.courses = {};
      this.events = [];
      this.rooms = {};
    }
  }

  public getEvents(): Event[] {
    return this.events;
  }

  public getRooms(): Room[] {
    return [];
  }

  public getCurrentEvents(): CurrentEvent[] {
    var activeEvents = this.events
      .filter((event) => {
        var now = new Date();
        var endDate = new Date(event.End)

        var endsInFuture = isFuture(endDate);

        var tomorrow = endOfDay(now);

        var endsToday = isBefore(endDate, tomorrow);
        var isVO = this.courses[event?.CourseID].Type === "VO";

        return isVO && event.RoomID && endsInFuture && endsToday;
      });

    if (activeEvents.length == 0) {
      activeEvents = this.events
        .filter((event) => {
          var now = new Date();
          var endDate = new Date(event.End)

          var endsInFuture = isFuture(endDate);

          var tomorrow = endOfDay(now);
          var endOfNextDay = addBusinessDays(tomorrow, 1);

          var endsNextDay = isBefore(endDate, endOfNextDay);
          var isVO = this.courses[event?.CourseID].Type === "VO";

          return isVO && event.RoomID && endsInFuture && endsNextDay;
        });
    }

    var grouped = groupBy(activeEvents, i => i.RoomID)

    var eventList = Object.entries(grouped).map(([key, value]) => {
      var room = this.rooms[key] as Room;

      return {
        EventTable: <>
          <Stack tokens={{ childrenGap: 2 }} >
            {value.sort((n1, n2) => isBefore(new Date(n1.Start), new Date(n2.Start)) ? -1 : 1).map(event => <>
              <Stack horizontal tokens={{ childrenGap: 8 }} >
                <span
                  title={this.courses[event?.CourseID].LongName}
                  style={{ width: 200, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {this.courses[event?.CourseID].LongName}
                </span>
                <span style={{ whiteSpace: 'nowrap' }}>{this.courses[event?.CourseID].Type}</span>
                <span
                  style={{ whiteSpace: 'nowrap' }}
                  title={new Date(event.Start).toLocaleDateString()}>
                  {new Date(event.Start).toLocaleTimeString("de-at", { timeStyle: "short" })} - {new Date(event.End).toLocaleTimeString("de-at", { timeStyle: "short" })}
                </span>
                <span title={event.RoomName}>[R]</span>
              </Stack>
            </>)}
          </Stack>
        </>,
        RoomLatitude: room.RoomLatitude,
        RoomLongitude: room.RoomLongitude
      } as CurrentEvent
    });

    return eventList;
  }

  public isDataLoaded(): boolean {
    return this.indexAvaliable;
  }

  public clear() {
    localStorage.removeItem('index-data');
    this.indexAvaliable = false;
    this.modules = {};
    this.courses = {};
    this.events = [];
    this.rooms = {};
  }

  public storeModule(module: Module) {
    this.modules[module.ID] = module;
  }

  public storeCourse(course: Course) {
    this.courses[course.ID] = course;
  }

  public storeEvent(event: Event) {
    this.events.push(event);
  }

  public storeRoom(room: Room) {
    this.rooms[room.RoomID] = room;
  }

  public commit() {
    if (this.indexAvaliable)
      this.clear();

    var dataObject = {
      modules: this.modules,
      courses: this.courses,
      events: this.events,
      rooms: this.rooms,
    };

    var json = JSON.stringify(dataObject);
    var data = pako.gzip(json, { to: 'string' });

    var b64encoded = Buffer.from(data, 'binary').toString('base64')
    localStorage.setItem('index-data', b64encoded);
  }
}
