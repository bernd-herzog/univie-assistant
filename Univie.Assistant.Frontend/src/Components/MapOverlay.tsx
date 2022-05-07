import React from 'react';
import { DefaultButton, Stack, SearchBox, IContextualMenuProps } from '@fluentui/react';
import { Navigator } from "../Shared/Navigator"

interface IMapOverlayState {
}

interface IMapOverlayProps {
  showAll: boolean,
  showVo: boolean,
  onShowAllChanged: (show: boolean) => void
  onShowVoChanged: (show: boolean) => void
}

export class MapOverlay extends React.Component<IMapOverlayProps, IMapOverlayState> {
  private getMenuProps(): IContextualMenuProps {
    return {
      items: [
        {
          key: 'showAll',
          text: 'Zeige alle Kurse',
          iconProps: { iconName: this.props.showAll ? 'CheckboxComposite' : 'Checkbox' },
          onClick: () => { this.props.onShowAllChanged(!this.props.showAll) }
        },
        {
          key: 'showVo',
          text: 'Zeige nur Vorlesungen',
          iconProps: { iconName: this.props.showVo ? 'CheckboxComposite' : 'Checkbox' },
          onClick: () => { this.props.onShowVoChanged(!this.props.showVo) }
        },
        {
          key: 'config',
          text: 'Kursliste anzeigen',
          iconProps: { iconName: 'AllApps' },
          onClick: () => Navigator.getInstance().navigate("/courses"),
        },
      ],
    }
  }

  render() {
    return <>
      <div style={{
        position: 'absolute',
        zIndex: 1000,
        right: '0px',
        border: '1px solid grey',
        backgroundColor: 'white',
        margin: '10px',
        padding: '5px',
      }}>
        <Stack horizontal tokens={{ childrenGap: 5 }} >
          <SearchBox styles={{ root: { width: 120 } }} placeholder="Suche" onSearch={newValue => console.log('value is ' + newValue)} />
          <DefaultButton split menuProps={this.getMenuProps()} iconProps={{ iconName: "AllApps" }} title="Kurse" onClick={() => Navigator.getInstance().navigate("/courses")}>Kurse</DefaultButton>
        </Stack>
      </div>
    </>;
  }
}