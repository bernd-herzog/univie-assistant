import { ProgressIndicator, Text, FontIcon, Stack, Spinner, SpinnerSize } from '@fluentui/react';
import React from 'react';
import { CourseStorage } from '../Data/CourseStorage';
import axios from 'axios';
import pako from 'pako';
import { Navigator } from "../Shared/Navigator"

interface ISetupViewState {
  versionChecked: boolean,
  downloadProgress: number,
  storeProgress: number,
}

export class SetupView extends React.Component<{}, ISetupViewState> {
  constructor(props: any) {
    super(props);

    this.state = {
      versionChecked: false,
      downloadProgress: 0,
      storeProgress: 0,
    };
  }

  componentDidMount() {
    this.setState({ versionChecked: true });
    this.downloadIndex();
  }

  private downloadIndex() {
    var courseStorage = new CourseStorage();
    courseStorage.clear();

    axios.get('index.json.gz', {
      onDownloadProgress: p => {
        this.setState({ downloadProgress: p.loaded / p.total });
      },
      decompress: true,
      responseType: 'arraybuffer'
    }).then(data => {
      this.setState({ downloadProgress: 1 });
      var json = pako.ungzip(data.data, { to: 'string' });
      var index = JSON.parse(json);
      this.extractIndex(index, courseStorage, 0);
    })
  }

  private extractIndex(index: any, courseStorage: CourseStorage, start: number) {

    setTimeout(() => {

      var total = index.Modules.length + index.Courses.length + index.Events.length + index.Rooms.length;
      var batchSize = Math.min(total - start, 1000)

      for (var i = 0; i < batchSize; i++) {

        if (start + i < index.Modules.length) {
          var module = index.Modules[start + i];
          courseStorage.storeModule(module);
        }
        else if (start + i < index.Modules.length + index.Courses.length) {
          var course = index.Courses[start + i - index.Modules.length];
          courseStorage.storeCourse(course);
        }
        else if (start + i < index.Modules.length + index.Courses.length + index.Events.length) {
          var event = index.Events[start + i - index.Modules.length - index.Courses.length];
          courseStorage.storeEvent({
            RoomID: event.RoomID,
            CourseID: event.CourseID,
            Start: event.Start,
            End: event.End
          });
        }
        else {
          var room = index.Rooms[start + i - index.Modules.length - index.Courses.length - index.Events.length];
          courseStorage.storeRoom(room);
        }
      }

      if (batchSize === 1000) {
        this.setState({ storeProgress: (start + batchSize - 1) / total });
        this.extractIndex(index, courseStorage, start + batchSize)
      }
      else {
        courseStorage.commit();
        this.setState({ storeProgress: 1 });
        setTimeout(function () { Navigator.getInstance().navigate("/"); }, 300);
      }

    }, 0);
  }

  render() {
    return <>
      <div style={{ margin: "auto", marginTop: "200px", width: "40vw", minWidth: "400px" }}>
        <Stack tokens={{ childrenGap: 5 }}>
          <Text variant="xxLarge">Initialisiere univie-assistant...</Text><br />

          {this.state.versionChecked === false &&
            <>
              <Stack horizontal tokens={{ childrenGap: 5 }}><Spinner size={SpinnerSize.small} /><Text>Pr&uuml;fe Version</Text></Stack>
            </>}

          {this.state.versionChecked &&
            <>
              <Stack horizontal tokens={{ childrenGap: 5 }}><FontIcon iconName="CheckMark" style={{ color: "green" }} /><Text>Pr&uuml;fe Version</Text></Stack>
            </>}

          {this.state.versionChecked === false &&
            <>
              <Stack horizontal tokens={{ childrenGap: 5 }}><FontIcon iconName="HourGlass" /><Text>Lade Index</Text></Stack>
            </>}

          {(this.state.versionChecked && this.state.downloadProgress < 1) &&
            <>
              <ProgressIndicator label="Lade Index" percentComplete={this.state.downloadProgress} />
            </>}

          {this.state.downloadProgress === 1 &&
            <>
              <Stack horizontal tokens={{ childrenGap: 5 }}><FontIcon iconName="CheckMark" style={{ color: "green" }} /><Text>Lade Index</Text></Stack>
            </>}

          {this.state.downloadProgress < 1 &&
            <>
              <Stack horizontal tokens={{ childrenGap: 5 }}><FontIcon iconName="HourGlass" /><Text>Verarbeite Index</Text></Stack>
            </>}

          {(this.state.downloadProgress === 1 && this.state.storeProgress < 1) &&
            <>
              <ProgressIndicator label="Verarbeite Index" percentComplete={this.state.storeProgress} />
            </>}

          {this.state.storeProgress === 1 &&
            <>
              <Stack horizontal tokens={{ childrenGap: 5 }}><FontIcon iconName="CheckMark" style={{ color: "green" }} /><Text>Verarbeite Index</Text></Stack>
            </>}

        </Stack>
      </div>
    </>;
  }
}
