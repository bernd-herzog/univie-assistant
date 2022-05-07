﻿import React from 'react';
import { CommandBar, PrimaryButton, SearchBox, Stack } from '@fluentui/react';
import { Navigator } from "../Shared/Navigator"
import { Card } from '../Components/Card';
import { HeaderCommandBar } from '../Components/HeaderCommandBar';
import { CourseStorage, Course, Module } from '../Data/CourseStorage';

interface B {
  key: string,
  name: string,
  description: string,
}

export class CourseSelectView extends React.Component<{}, {
  courses: Course[]
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      courses: [],
    };
  }

  render() {
    return <>
      <HeaderCommandBar><CommandBar items={[
        {
          key: 'back',
          text: 'Zurück',
          iconProps: { iconName: 'Back' },
          onClick: () => { Navigator.getInstance().navigate("/courses") }
        },
        {
          key: 'map',
          text: 'Zurück zur Karte',
          iconProps: { iconName: 'Nav2DMapView' },
          onClick: () => { Navigator.getInstance().navigate("/map") }
        },
      ]} /></HeaderCommandBar>

      <Card headerText={"Kursauswahl"} >

        <SearchBox
          styles={{ root: { marginBottom: 30 } }}
          placeholder="Suche" onSearch={searchText => {
            var courses = Object.entries(CourseStorage.getInstance().getCourses()).map(([, course]) => course);
            var machingCourses = courses.filter(_ => _.LongName.toLowerCase().match(searchText.toLowerCase() ?? ''))
            this.setState({ courses: machingCourses });
          }} />

        <Stack tokens={{ childrenGap: 10 }}>
          {this.state.courses.map(course => {
            var userCourses = CourseStorage.getInstance().getUserCourses();

            return (<>
              <div
                style={{
                  padding: 12,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CCCCCC'
                }}>

                <Stack tokens={{ childrenGap: 4 }}>
                  {this.getModules(course).map((module, index) => <><span style={{ marginLeft: index * 10 }}>{module.Name}</span></>)}
                  <span><b>{course.LongName}</b> ({course.Type})</span>

                  <PrimaryButton
                    disabled={userCourses.includes(course.ID)}
                    style={{ marginTop: 20 }}
                    text="Hinzufügen"
                    onClick={() => {
                      CourseStorage.getInstance().addUserCourse(course.ID)
                      Navigator.getInstance().navigate("/courses")
                    }} />
                </Stack>
              </div>
            </>)
          })}
        </Stack>
      </Card>
    </>;
  }

  getModules(course: Course): Module[] {
    var modules: Module[] = []

    var module = CourseStorage.getInstance().getModule(course.ModuleID);
    modules.push(module);

    while (module.ModuleID) {
      module = CourseStorage.getInstance().getModule(module.ModuleID);
      modules.push(module);
    }

    return modules.reverse();
  }
}
