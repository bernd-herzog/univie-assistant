import React from 'react';
import { CommandBar, ICommandBarItemProps, IconButton, Stack } from '@fluentui/react';
import { Navigator } from "../Shared/Navigator"
import { Card } from '../Components/Card';
import { HeaderCommandBar } from '../Components/HeaderCommandBar';
import { QuestionCalloutWrapper } from '../Components/QuestionCallout';
import { Course, CourseStorage, Module } from '../Data/CourseStorage';

export class CourseView extends React.Component<{}, {}> {

  _items: ICommandBarItemProps[] = [
    {
      key: 'newItem',
      text: 'Hinzufügen',
      iconProps: { iconName: 'Add' },
      onClick: () => { Navigator.getInstance().navigate("/courseSelect") }
    },
    {
      key: 'back',
      text: 'Zurück zur Karte',
      iconProps: { iconName: 'Nav2DMapView' },
      onClick: () => { Navigator.getInstance().navigate("/map") }
    },
  ];

  render() {

    return <>
      <HeaderCommandBar><CommandBar items={this._items} /></HeaderCommandBar>
      <Card headerText={"Meine Kurse"} >

        <Stack tokens={{ childrenGap: 10 }}>
          {
            CourseStorage.getInstance().getUserCourses().map(courseID => {
              var course = CourseStorage.getInstance().getCourse(courseID);
              return (
                <>
                  <div
                    style={{
                      padding: 12,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CCCCCC'
                    }}>

                    <Stack tokens={{ childrenGap: 4 }}>

                      {this.getModules(course).map((module, index) => <><span style={{ marginLeft: index * 10 }}>{module.Name}</span></>)}
                      <span><b>{course.LongName}</b> ({course.Type})</span>

                      <QuestionCalloutWrapper
                        titleText={'Löschen'}
                        questionText={'Möchten Sie den Kurs wirklich löschen?'}
                        okText={'Löschen'}
                        cancelText={'Abbrechen'}
                        onOkPressed={() => {
                          CourseStorage.getInstance().removeUserCourse(courseID);
                          this.setState({});
                        }} >
                        <IconButton
                          iconProps={{ iconName: 'Delete' }}
                          title="Delete"
                          ariaLabel="Delete" />
                      </QuestionCalloutWrapper>
                    </Stack>
                  </div>
                </>);
            })
          }
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
