import * as React from 'react';
import { Text } from '@fluentui/react/lib/Text';

const card: React.CSSProperties = {
  padding: 28,
  margin: 28,
  backgroundColor: 'white',
  maxWidth: 800
};

const card_header: React.CSSProperties = {
  marginBottom: 28,
};

const card_body: React.CSSProperties = {
};

interface ICardProps {
  headerText?: string
}

export class Card extends React.Component<ICardProps, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <div style={card}>
          {this.props.headerText && <div style={card_header}><Text variant={'xLarge'}>{this.props.headerText}</Text></div>}
          <div style={card_body}>{this.props.children}</div>
        </div>
      </>
    )
  }
}