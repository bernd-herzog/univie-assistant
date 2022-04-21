import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapSettingsPanel } from './MapSettingsPanel';

export class Map extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props)
    }

    render() {
        return <>
            <MapSettingsPanel />
            <MapContainer
                style={{ width: '100vw', height: '100vh' }}
                center={[48.208333, 16.373056]}
                zoom={14} >

                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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

