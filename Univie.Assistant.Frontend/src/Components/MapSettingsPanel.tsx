import React from 'react';
import { Toggle } from '@fluentui/react';

export class MapSettingsPanel extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props)
    }

    render() {
        return <>
            <div style={{
                position: 'absolute',
                zIndex: 99999,
                right: '0px',
                border: '1px solid blue',
                backgroundColor: 'white',
                margin: '5px',
                paddingLeft: '5px',
                paddingRight: '5px',
                width: '80px'
            }}>
                <Toggle label="Zeige Karte" defaultChecked onText="An" offText="Aus" onChange={() => {  }} />
            </div>
        </>;
    }
}