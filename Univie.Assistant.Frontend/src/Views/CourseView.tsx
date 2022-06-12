import React from 'react';
import { CommandBar, ICommandBarItemProps, IconButton, Stack } from '@fluentui/react';
import { Navigator } from "../Shared/Navigator"
import { Card } from '../Components/Card';
import { HeaderCommandBar } from '../Components/HeaderCommandBar';
import { QuestionCalloutWrapper } from '../Components/QuestionCallout';
import { CourseStorage } from '../Data/CourseStorage';

export class CourseView extends React.Component<{}, {}> {

  _items: ICommandBarItemProps[] = [
    {
      key: 'newItem',
      text: 'Hinzufügen',
      iconProps: { iconName: 'Add' },
      onClick: () => { Navigator.getInstance().navigate("/courseSelect") }
    },
    {
      key: 'newRandom',
      text: 'Zufallsstudium',
      iconProps: { iconName: 'Add' },
      onClick: () => { Navigator.getInstance().navigate("/randomSelect") }
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

                <div
                  key={courseID}
                  style={{
                    padding: 12,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CCCCCC'
                  }}>

                  <Stack tokens={{ childrenGap: 4 }}>

                    {CourseStorage.getModulesTreeFromCourse(course.ModuleID).map((module, index) => <span key={index} style={{ marginLeft: index * 10 }}>{module.Name}</span>)}
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
              );
            })
          }

          {
            CourseStorage.getInstance().getRandomCourses().map(seed => {
              return (

                <div
                  key={seed}
                  style={{
                    padding: 12,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CCCCCC'
                  }}>

                  <Stack tokens={{ childrenGap: 4 }}>


                    <span><b>Zufallsstudium</b> ({seed})</span>

                    <QuestionCalloutWrapper
                      titleText={'Löschen'}
                      questionText={'Möchten Sie den Kurs wirklich löschen?'}
                      okText={'Löschen'}
                      cancelText={'Abbrechen'}
                      onOkPressed={() => {
                        CourseStorage.getInstance().removeRandomCourse(seed);
                        this.setState({});
                      }} >
                      <IconButton
                        iconProps={{ iconName: 'Delete' }}
                        title="Delete"
                        ariaLabel="Delete" />
                    </QuestionCalloutWrapper>
                  </Stack>
                </div>
              );
            })
          }
        </Stack>
      </Card>
    </>;
  }
}
