import { Button } from '@fluentui/react';
import React from 'react';
import { Navigator } from "../Shared/Navigator"

export class CourseList extends React.Component<{}, {}> {
  render() {
    return <>
      Die Kursliste ist leer.

      <Button text="Map" onClick={() => Navigator.getInstance().navigate("/map")} />
    </>;
  }
}
