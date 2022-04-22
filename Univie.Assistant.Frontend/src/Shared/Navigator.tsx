import * as React from "react";
import { NavigateFunction, To, useNavigate } from "react-router-dom";

export class Navigator {
  private static instance?: Navigator;

  static getInstance(): Navigator {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private navigateFunction?: NavigateFunction;

  public initialize(navigate: NavigateFunction): void {
    this.navigateFunction = navigate
  }

  public navigate(location: To): void {
    if (this.navigateFunction) {
      this.navigateFunction(location);
    }
  }
}

class WrappedNavigatorInitializer extends React.Component<{
  navigate: NavigateFunction,
}, {}> {
  constructor(props: any) {
    super(props);

    var nav = Navigator.getInstance();
    nav.initialize(this.props.navigate);
  }

  componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    var nav = Navigator.getInstance();
    nav.initialize(this.props.navigate);
  }

  render() {
    return <></>;
  }
}

export function NavigatorInitializer() {
  const navigate = useNavigate()

  return (
    <WrappedNavigatorInitializer navigate={navigate} />
  );
}