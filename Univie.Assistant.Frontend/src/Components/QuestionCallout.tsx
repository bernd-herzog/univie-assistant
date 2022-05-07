import * as React from 'react';
import './CrudList.css';
import { getId } from '@fluentui/utilities';
import { Stack, FocusTrapCallout, FocusZone, FocusZoneTabbableElements, Text, DefaultButton, PrimaryButton } from '@fluentui/react';

export interface IQuestionCalloutWrapperProps {
  titleText: string,
  questionText: string,
  okText: string,
  cancelText: string,
  onOkPressed: () => void
};

export class QuestionCalloutWrapper extends React.Component<IQuestionCalloutWrapperProps, {}> {
  private _parentId: string;
  private _showCalloutFunc?: () => void;

  constructor(props: IQuestionCalloutWrapperProps) {
    super(props);

    this._parentId = getId('parentId')

    this.state = {
    };
  }

  render() {
    return (
      <>
        <span id={this._parentId} onClick={(() => {
          if (this._showCalloutFunc)
            this._showCalloutFunc();
        }).bind(this)}>
          {this.props.children}
        </span>

        <QuestionCallout
          titleText={this.props.titleText}
          questionText={this.props.questionText}
          okText={this.props.okText}
          cancelText={this.props.cancelText}
          onOkPressed={this.props.onOkPressed}
          showCallout={((showCalloutFunc: () => void) => { this._showCalloutFunc = showCalloutFunc; }).bind(this)}
          targetId={this._parentId} />
      </>
    )
  }
}

export interface IQuestionCalloutProps extends IQuestionCalloutWrapperProps {
  showCallout: (showCalloutFunc: () => void) => void,
  targetId: string
};

export interface IQuestionCalloutState {
  calloutVisible: boolean
};

export class QuestionCallout extends React.Component<IQuestionCalloutProps, IQuestionCalloutState> {
  constructor(props: IQuestionCalloutProps) {
    super(props);

    this.state = {
      calloutVisible: false
    };
  }

  componentDidMount() {
    this.props.showCallout((() => this.updateCalloutVisibility(true)).bind(this))
  }

  render() {
    return (
      <>
        {this.state.calloutVisible && <>
          <FocusTrapCallout
            target={`#${this.props.targetId}`}
            role="alertdialog"
            gapSpace={0}
            onDismiss={(() => this.updateCalloutVisibility(false)).bind(this)}
            setInitialFocus
            style={{
              width: 320,
              padding: '20px 24px'
            }} >
            <Text block variant="xLarge" style={{ marginBottom: 12, fontWeight: 'semilight' }}>
              {this.props.titleText}
            </Text>
            <Text block variant="small">
              {this.props.questionText}
            </Text>
            <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
              <Stack gap={8} horizontal style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 20
              }}>
                <PrimaryButton onClick={(() => {
                  this.props.onOkPressed();
                  this.updateCalloutVisibility(false);
                }).bind(this)}>{this.props.okText}</PrimaryButton>
                <DefaultButton onClick={(() => this.updateCalloutVisibility(false)).bind(this)}>{this.props.cancelText}</DefaultButton>
              </Stack>
            </FocusZone>
          </FocusTrapCallout>
        </>}
      </>
    )
  }

  private updateCalloutVisibility(value: boolean) {
    this.setState({
      calloutVisible: value
    })
  }
}