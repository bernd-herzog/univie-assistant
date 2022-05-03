import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapOverlay } from '../Components/MapOverlay';
import { CourseStorage } from '../Data/CourseStorage';

export class MapView extends React.Component<{}, {
  showAll: boolean
}> {
  constructor(props: any) {
    super(props);
    this.state = { showAll: true };
  }
  render() {
    var courseStorage = new CourseStorage();

    return <>
      <MapContainer
        style={{ width: '100vw', height: '100vh' }}
        center={[48.208333, 16.373056]}
        zoom={14} >

        <MapOverlay showAll={this.state.showAll} onShowAllChanged={(showAll) => { this.setState({ showAll: showAll }) }} />

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors | univie-assistant <a href="https://github.com/bernd-herzog/univie-assistant" target="_blank">Source</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {this.state.showAll ? <>
          {courseStorage.getCurrentEvents().map((currentEvent) => {
            return (
              <>
                <Marker position={[currentEvent.RoomLatitude, currentEvent.RoomLongitude]}>
                  <Popup>
                    {currentEvent.EventTable}
                  </Popup>
                </Marker>
              </>)
          })}


        </> : <>

          {courseStorage.getRooms().map((room, i, arr) => {
            return (
              <>
                <Marker position={[room.RoomLatitude, room.RoomLongitude]}>
                  <Popup>
                    {room.RoomID}
                  </Popup>
                </Marker>

              </>)
          })}

        </>}


      </MapContainer>
    </>;
  }
}
