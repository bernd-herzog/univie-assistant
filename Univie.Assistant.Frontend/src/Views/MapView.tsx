import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapOverlay } from '../Components/MapOverlay';
import * as CourseStorage from '../Data/CourseStorage';
import { Stack } from '@fluentui/react';
import { isBefore } from 'date-fns'

const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

export class MapView extends React.Component<{}, {
  showAll: boolean,
  showVo: boolean,
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      showAll: true,
      showVo: true,
    };
  }

  render() {
    var courseStorage = CourseStorage.CourseStorage.getInstance();
    var currentEvents = courseStorage.getCurrentEvents();

    var eventsToShow = currentEvents.filter(event => {
      var isVO = courseStorage.getCourse(event.CourseID).Type == "VO";
      var isOwn = courseStorage.getUserCourses().includes(event.CourseID);
      return (isVO || this.state.showVo == false) && (isOwn || this.state.showAll);
    });

    var groupedEvents = groupBy(eventsToShow, item => item.RoomID);
    var locationList = Object.entries(groupedEvents);

    return <>
      <MapContainer
        style={{ width: '100vw', height: '100vh' }}
        center={[48.208333, 16.373056]}
        zoom={14} >

        <MapOverlay
          showAll={this.state.showAll}
          showVo={this.state.showVo}
          onShowAllChanged={(show) => { this.setState({ showAll: show }) }}
          onShowVoChanged={(show) => { this.setState({ showVo: show }) }}
        />

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors | univie-assistant <a href="https://github.com/bernd-herzog/univie-assistant" target="_blank">Source</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {
          locationList.map(([roomID, events]) => {
            var room = courseStorage.getRoom(roomID);

            return (<>
              <Marker position={[room.RoomLatitude, room.RoomLongitude]}>
                <Popup>

                  <Stack
                    tokens={{ childrenGap: 2 }}
                    style={{ maxHeight: '70vh', overflow: 'scroll' }}
                  >
                    {
                      events
                        .sort((n1, n2) => isBefore(new Date(n1.Start), new Date(n2.Start)) ? -1 : 1)
                        .map(event => {
                          return this.renderEvent(event);
                        })
                    }
                  </Stack>
                </Popup>
              </Marker>
            </>)
          })
        }
      </MapContainer>
    </>;
  }

  renderEvent(event: CourseStorage.Event): JSX.Element {
    var courseStorage = CourseStorage.CourseStorage.getInstance();
    var course = courseStorage.getCourse(event?.CourseID);

    return (<>
      <Stack horizontal tokens={{ childrenGap: 8 }} >
        <span
          title={course.LongName}
          style={{ width: 200, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {course.LongName}
        </span>
        <span style={{ whiteSpace: 'nowrap' }}>{course.Type}</span>
        <span
          style={{ whiteSpace: 'nowrap' }}
          title={new Date(event.Start).toLocaleDateString()}>
          {new Date(event.Start).toLocaleTimeString("de-at", { timeStyle: "short" })} - {new Date(event.End).toLocaleTimeString("de-at", { timeStyle: "short" })}
        </span>
        <span title={event.RoomName}>[R]</span>
      </Stack>
    </>)
  }

}
