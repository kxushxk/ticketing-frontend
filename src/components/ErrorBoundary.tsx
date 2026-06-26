import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorFallback } from "../shared/components/ErrorFallback";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <ErrorFallback
            error={this.state.error}
            resetErrorBoundary={this.handleReset}
          />
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
