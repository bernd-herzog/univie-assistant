import React from 'react';
import { Map } from "../Components/Map"

export class MapView extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props)
    }

    render() {
        return <>
            <Map />
        </>;
    }
}
