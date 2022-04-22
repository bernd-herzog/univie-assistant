import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavigatorInitializer } from "./Navigator"

export class Layout extends React.Component<{}, {}> {
  render() {
    return <>
      <NavigatorInitializer />
      <Outlet />
    </>;
  }
}
