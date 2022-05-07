import * as React from 'react';

const header_card: React.CSSProperties = {
  margin: 0,
  backgroundColor: 'white',
  borderStyle: 'solid',
  borderWidth: 28,
  borderTopWidth: 0,
  borderColor: 'grey',
  display: "block",
  position: "fixed",
  height: 40,
  zIndex: 99999
};

const header_card_placeholder: React.CSSProperties = {
  margin: 0,
  height: 40,
};

export class HeaderCommandBar extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <div style={header_card}>
          {this.props.children}
        </div>
        <div style={header_card_placeholder}>
        </div>
      </>
    )
  }
}