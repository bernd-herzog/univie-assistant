import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapOverlay } from './MapOverlay';

export class Map extends React.Component<{}, {}> {
  render() {
    return <>
      <MapContainer
        style={{ width: '100vw', height: '100vh' }}
        center={[48.208333, 16.373056]}
        zoom={14} >

        <MapOverlay />

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors | univie-assistant <a href="https://github.com/bernd-herzog/univie-assistant" target="_blank">Source</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[48.208333, 16.373056]}>
          <Popup>
            Wien ist hier. <br /> Genau hier.
          </Popup>
        </Marker>
      </MapContainer>
    </>;
  }
}
