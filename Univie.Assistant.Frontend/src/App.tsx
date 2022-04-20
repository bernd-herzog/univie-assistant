import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'


export default class App extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props)
    }

    render() {
        return <>
            <MapContainer
                style={{ width: '800px', height: '800px' }}
                center={[48.208333, 16.373056]}
                zoom={14} >

                <TileLayer

                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[48.208333, 16.373056]}>
                    <Popup>
                        Wien ist hier. <br /> Genau hier.
                    </Popup>
                </Marker>
            </MapContainer>
        </>;
    }
}