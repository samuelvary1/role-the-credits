import React, { Component, ErrorInfo } from "react";
import * as Sentry from "@sentry/browser/esm";

type ComponentState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<{}, ComponentState> {
  state = {
    hasError: false
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true });
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key =>
        scope.setExtra(key, errorInfo[key as keyof ErrorInfo])
      );
      Sentry.captureException(error);
    });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      // render fallback UI
      return <h1 style={{ textAlign: "center" }}>Something went wrong</h1>;
    }
    return children;
  }
}

export default ErrorBoundary;
