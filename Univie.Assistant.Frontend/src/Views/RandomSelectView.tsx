import React from 'react';
import { CommandBar, PrimaryButton, SearchBox, Stack, TextField } from '@fluentui/react';
import { Navigator } from "../Shared/Navigator"
import { Card } from '../Components/Card';
import { HeaderCommandBar } from '../Components/HeaderCommandBar';
import { CourseStorage, Course, Module } from '../Data/CourseStorage';


export class RandomSelectView extends React.Component<{}, {
  seed: string,
}> {

  constructor(props: any) {
    super(props);
    this.state = {
      seed: "",
    };
  }

  render() {
    return <>
      <HeaderCommandBar><CommandBar items={[
        {
          key: 'back',
          text: 'Zurück',
          iconProps: { iconName: 'Back' },
          onClick: () => { Navigator.getInstance().navigate("/courses") }
        },
        {
          key: 'map',
          text: 'Zurück zur Karte',
          iconProps: { iconName: 'Nav2DMapView' },
          onClick: () => { Navigator.getInstance().navigate("/map") }
        },

      ]} /></HeaderCommandBar>

      <Card headerText={"Einstellungen"} >

        <Stack tokens={{ childrenGap: 4 }}>

          <TextField label="Random-Seed" value={this.state.seed} onChange={(ev, newValue) => this.setState({ seed: newValue ?? "" })} />

          <PrimaryButton
            style={{ marginTop: 20 }}
            text="Hinzufügen"
            onClick={() => { CourseStorage.getInstance().addRandomCourse(this.state.seed); Navigator.getInstance().navigate("/courses"); }} />

        </Stack>
      </Card>

    </>;
  }
}

