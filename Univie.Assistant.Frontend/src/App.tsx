import React from 'react';
import { Routes, Route } from "react-router-dom";
import { MapView } from "./Views/MapView"
import { CourseView } from "./Views/CourseView"
import { Layout } from './Shared/Layout';
import { CourseStorage } from './Data/CourseStorage';
import { Navigator } from "./Shared/Navigator"
import { SetupView } from './Views/SetupView';

export default class App extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);

    var courseStorage = new CourseStorage();
    if (courseStorage.isDataLoaded() === false) {
      setTimeout(function () { Navigator.getInstance().navigate("/init"); }, 300);
    }
  }

  render() {
    return <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/map" element={<MapView />} />
          <Route path="/courses" element={<CourseView />} />
          <Route path="/init" element={<SetupView />} />
          <Route index element={<MapView />} />
        </Route>
      </Routes>
    </>;
  }
}
