import React from 'react';
import { Routes, Route } from "react-router-dom";
import { MapView } from "./Views/MapView"
import { CourseView } from "./Views/CourseView"

export default class App extends React.Component<{}, {
}> {
    constructor(props: any) {
        super(props)
    }

    render() {
        return <>
            <Routes>
                <Route path="/map" element={<MapView />} />
                <Route path="/courses" element={<CourseView />} />
                <Route index element={<MapView />} />
            </Routes>
        </>;
    }
}
