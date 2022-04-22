import React from 'react';
import { Routes, Route } from "react-router-dom";
import { MapView } from "./Views/MapView"
import { CourseView } from "./Views/CourseView"
import { Layout } from './Shared/Layout';

export default class App extends React.Component<{}, {}> {
  render() {
    return <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/map" element={<MapView />} />
          <Route path="/courses" element={<CourseView />} />
          <Route index element={<MapView />} />
        </Route>
      </Routes>
    </>;
  }
}
