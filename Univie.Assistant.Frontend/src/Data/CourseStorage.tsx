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
  Room: string,
}

export class CourseStorage {
  private indexAvaliable: boolean;
  private modules: { [id: string]: Module };
  private courses: { [id: string]: Course };
  private events: Event[];

  constructor() {
    var indexData = localStorage.getItem('index-data');
    this.indexAvaliable = indexData !== null;

    if (indexData !== null) {
      var data = Buffer.from(indexData, 'base64')
      var indexObject = JSON.parse(pako.ungzip(data, { to: 'string' }))

      this.modules = indexObject.modules;
      this.courses = indexObject.courses;
      this.events = indexObject.events;
    } else {
      this.modules = {};
      this.courses = {};
      this.events = [];
    }
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

  public commit() {
    if (this.indexAvaliable)
      this.clear();

    var dataObject = {
      modules: this.modules,
      courses: this.courses,
      events: this.events,
    };

    var json = JSON.stringify(dataObject);
    var data = pako.gzip(json, { to: 'string' });

    var b64encoded = Buffer.from(data, 'binary').toString('base64')
    localStorage.setItem('index-data', b64encoded);
  }
}
