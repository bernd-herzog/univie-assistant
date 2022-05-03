import React from 'react';
import { Button } from '@fluentui/react';
import { Navigator } from "../Shared/Navigator"

export class CourseView extends React.Component<{}, {}> {
  render() {
    return <>
      Die Kursliste ist leer.

      <Button text="Map" onClick={() => Navigator.getInstance().navigate("/map")} />
    </>;
  }
}
