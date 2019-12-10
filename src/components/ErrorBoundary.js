import React, { Component } from 'react'

class ErrorBoundary extends Component {
  state = {
    hasError: false
  }

  componentDidCatch(e, i) {
    this.setState({ hasError: true });
  }

  static getDerivedStateFromError(e, i) {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return <div>Has an error</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;