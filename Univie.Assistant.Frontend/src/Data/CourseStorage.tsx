import pako from 'pako';
import { Buffer } from 'buffer';
import { isBefore, endOfDay, startOfDay, isAfter, addDays } from 'date-fns'
import * as rnd from '../Shared/random';
import groupBy from '../Shared/groupBy';

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

  public getCurrentEvents(daysToAdd: number): Event[] {
    var now = new Date();
    var today = startOfDay(now);
    var tomorrow = endOfDay(now);

    if (daysToAdd !== 0) {
      today = addDays(today, daysToAdd);
      tomorrow = addDays(tomorrow, daysToAdd);
    }

    var activeEvents = this.events
      .filter((event) => {
        var endDate = new Date(event.End)

        var startsToday = isAfter(endDate, today);
        var endsToday = isBefore(endDate, tomorrow);

        return event.RoomID && startsToday && endsToday;
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

  public getUserRandomCourses(daysToAdd: number): string[] {
    var randomCourses = this.getRandomCourses();

    if (randomCourses.length == 0)
      return []

    var currentEvents = this.getCurrentEvents(daysToAdd).filter(event => this.getCourse(event.CourseID).Type == "VO");

    var events = currentEvents.map(event => {
      var course = this.getCourse(event.CourseID)
      var moduleTree = CourseStorage.getModulesTreeFromCourse(course.ModuleID)
      return moduleTree.map((module, index) => ({ module: module, event: event, level: index }))
    })

    var groupedEvents = groupBy(events.flat(), item => item.module.ID);
    var eventList = Object.entries(groupedEvents);

    var filteredEvents = eventList.filter(([moduleID, event]) => event.length > 2 && event[0].level > 1)

    if (filteredEvents.length == 0)
      return []

    var seed = rnd.cyrb128(randomCourses[0])
    var rand = rnd.sfc32(seed[0], seed[1], seed[2], seed[3]);

    var randomNumber = Math.floor(rand() * filteredEvents.length);
    var eventSelection = filteredEvents[randomNumber];

    return eventSelection[1].map(event => event.event.CourseID)
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

  public getRandomCourses(): string[] {
    var userCoursesData = localStorage.getItem('random-courses');
    var userCourses = JSON.parse(userCoursesData ?? '[]')
    return userCourses
  }

  public addRandomCourse(seed: string) {
    var userCoursesData = localStorage.getItem('random-courses');
    var userCourses: string[] = JSON.parse(userCoursesData ?? '[]');

    userCourses.push(seed);

    var json = JSON.stringify(userCourses);
    localStorage.setItem('random-courses', json);
  }


  public removeRandomCourse(courseID: string) {
    var userCoursesData = localStorage.getItem('random-courses');
    var userCourses: string[] = JSON.parse(userCoursesData ?? '[]');

    const index = userCourses.indexOf(courseID);
    userCourses.splice(index, 1);

    var json = JSON.stringify(userCourses);
    localStorage.setItem('random-courses', json);
  }

  public static getModulesTreeFromCourse(moduleID: string): Module[] {
    var modules: Module[] = []

    var module = CourseStorage.getInstance().getModule(moduleID);
    modules.push(module);

    while (module.ModuleID) {
      module = CourseStorage.getInstance().getModule(module.ModuleID);
      modules.push(module);
    }

    return modules.reverse();
  }
}
