import pako from 'pako';
import { Buffer } from 'buffer';

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
}

interface Room {
  RoomID: string,
  RoomLatitude: number,
  RoomLongitude: number,
}

interface CurrentEvent {
  EventTable: string,
  RoomLatitude: number,
  RoomLongitude: number,
}

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
        var now = Date.now();
        return event.RoomID && (now - new Date(event.Start).getTime() > 0 && now - new Date(event.End).getTime() < 0);
      })
      .map((event) => {
        var room = this.rooms[event.RoomID]
        var course = this.courses[event.CourseID]
        return { EventTable: "Kurs " + course?.LongName + " von " + new Date(event.Start).toLocaleTimeString("de-at", { timeStyle: "short" }) + " bis " + new Date(event.End).toLocaleTimeString("de-at", { timeStyle: "short" }), RoomLatitude: room.RoomLatitude, RoomLongitude: room.RoomLongitude } as CurrentEvent
      });

    return activeEvents;
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
