import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapOverlay } from '../Components/MapOverlay';
import * as CourseStorage from '../Data/CourseStorage';
import { Stack } from '@fluentui/react';
import { isBefore, isFuture } from 'date-fns'
import groupBy from '../Shared/groupBy';

export class MapView extends React.Component<{}, {
  showAll: boolean,
  showVo: boolean,
}> {

  private _mapController: MapController;

  constructor(props: any) {
    super(props);
    this.state = {
      showAll: true,
      showVo: true,
    };

    this._mapController = new MapController();
  }

  render() {
    var locationList = this._mapController.getLocationList(this.state.showVo, this.state.showAll);

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
          locationList.map((mapEntry) => {
            return (
              <Marker position={[mapEntry.room.RoomLatitude, mapEntry.room.RoomLongitude]} key={mapEntry.room.RoomID} >
                <Popup>
                  <Stack
                    tokens={{ childrenGap: 2 }}
                    style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    {
                      mapEntry.events
                        .sort((n1, n2) => isBefore(new Date(n1.event.Start), new Date(n2.event.Start)) ? -1 : 1)
                        .map(event => {
                          return this.renderPopupListEntry(event);
                        })
                    }
                  </Stack>
                </Popup>
              </Marker>
            )
          })
        }
      </MapContainer>
    </>;
  }

  renderPopupListEntry(event: IMapEvent): JSX.Element {
    return (
      <Stack key={event.course.ID} style={{ border: "solid #AAAAAA 1px", background: "#EEEEEE", padding: "2px" }}>
        <Stack horizontal tokens={{ childrenGap: 8 }} >
          <span
            title={event.course.LongName}
            style={{ width: 200, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {event.course.LongName}
          </span>
          <span style={{ whiteSpace: 'nowrap' }}>{event.course.Type}</span>
          <span
            style={{ whiteSpace: 'nowrap' }}
            title={new Date(event.event.Start).toLocaleDateString()}>
            {new Date(event.event.Start).toLocaleTimeString("de-at", { timeStyle: "short" })} - {new Date(event.event.End).toLocaleTimeString("de-at", { timeStyle: "short" })}
          </span>
        </Stack>
        <span style={{ fontSize: "0.75em" }} title={event.event.RoomName}>{event.event.RoomName}</span>
      </Stack>
    )
  }
}


interface IMapRoom {
  room: CourseStorage.Room,
  events: IMapEvent[]
}

interface IMapEvent {
  event: CourseStorage.Event,
  course: CourseStorage.Course
}

class MapController {

  private _courseStorage: CourseStorage.CourseStorage;

  constructor() {
    this._courseStorage = CourseStorage.CourseStorage.getInstance();
  }

  public getLocationList(showVo: boolean, showAll: boolean): IMapRoom[] {

    var eventsToShow = this.getDayEvents(showVo, showAll);

    var groupedEvents = groupBy(eventsToShow, item => item.RoomID);
    var locationList = Object.entries(groupedEvents);

    var resolvedEvents = locationList.map(([roomID, events]) => {
      var room = this._courseStorage.getRoom(roomID);
      var mapEvents = events.map(event => {
        var mapEvent = {
          event: event,
          course: this._courseStorage.getCourse(event.CourseID)
        } as IMapEvent
        return mapEvent
      });
      return { room, events: mapEvents } as IMapRoom
    });

    return resolvedEvents;
  }

  private getDayEvents(showVo: boolean, showAll: boolean): CourseStorage.Event[] {

    for (var i = 0; i < 24; i++) {
      var currentEvents = this._courseStorage.getCurrentEvents(i);
      var userRandomCourses = this._courseStorage.getUserRandomCourses(i);

      var eventsToShow = currentEvents.filter(event => {
        var endDate = new Date(event.End)
        var endsInFuture = isFuture(endDate);

        var isVO = this._courseStorage.getCourse(event.CourseID).Type == "VO";
        var isOwn = this._courseStorage.getUserCourses().includes(event.CourseID);
        var isRandomCourse = userRandomCourses.includes(event.CourseID);
        return (isVO || showVo === false) && (isOwn || isRandomCourse || showAll) && endsInFuture;
      });

      if (eventsToShow.length !== 0) {
        return eventsToShow
      }
    }

    return [];
  }
}