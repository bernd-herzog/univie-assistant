import pako from 'pako';
import { Buffer } from 'buffer';
import { addBusinessDays, isAfter, isBefore, isPast, isFuture, startOfDay, endOfDay } from 'date-fns'

export interface Module {
  ID: string,
  ModuleID: string,
  Name: string,
}

export interface Course {
  ID: string,
  ModuleID: string,
  LongName: string,
  Type: string,
}

export interface Event {
  CourseID: string,
  Start: string,
  End: string,
  RoomID: string,
  RoomName: string,
}

export interface Room {
  RoomID: string,
  RoomLatitude: number,
  RoomLongitude: number,
}


export class CourseStorage {
  private static Instance: CourseStorage;
  public static getInstance(): CourseStorage {
    return CourseStorage.Instance ?? (CourseStorage.Instance = new CourseStorage());
  }

  private indexAvaliable: boolean;
  private modules: { [id: string]: Module };
  private courses: { [id: string]: Course };
  private events: Event[];
  private rooms: { [id: string]: Room };

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

  public storeModule(module: Module) {
    this.modules[module.ID] = module;
  }

  public getModules(): { [id: string]: Module } {
    return this.modules;
  }

  public getModule(id: string): Module {
    return this.modules[id];
  }


  public storeCourse(course: Course) {
    this.courses[course.ID] = course;
  }

  public getCourses(): { [id: string]: Course } {
    return this.courses;
  }

  public getCourse(id: string): Course {
    return this.courses[id];
  }

  public storeEvent(event: Event) {
    this.events.push(event);
  }

  public getEvents(): Event[] {
    return this.events;
  }

  public storeRoom(room: Room) {
    this.rooms[room.RoomID] = room;
  }

  public getRooms(): { [id: string]: Room } {
    return this.rooms;
  }

  public getRoom(id: string): Room {
    return this.rooms[id];
  }

  public getCurrentEvents(): Event[] {
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

          return event.RoomID && endsInFuture && endsNextDay;
        });
    }

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

  public getUserCourses(): string[] {
    var userCoursesData = localStorage.getItem('user-courses');
    var userCourses = JSON.parse(userCoursesData ?? '[]')
    return userCourses
  }

  public addUserCourse(courseID: string) {
    var userCoursesData = localStorage.getItem('user-courses');
    var userCourses: string[] = JSON.parse(userCoursesData ?? '[]');

    userCourses.push(courseID);

    var json = JSON.stringify(userCourses);
    localStorage.setItem('user-courses', json);
  }

  public removeUserCourse(courseID: string) {
    var userCoursesData = localStorage.getItem('user-courses');
    var userCourses: string[] = JSON.parse(userCoursesData ?? '[]');

    const index = userCourses.indexOf(courseID);
    userCourses.splice(index, 1);

    var json = JSON.stringify(userCourses);
    localStorage.setItem('user-courses', json);
  }
}
