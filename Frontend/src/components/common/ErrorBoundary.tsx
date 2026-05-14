import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorState } from "@/components/common/ErrorState";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Application error boundary", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="container flex min-h-screen items-center justify-center">
          <ErrorState
            title="Application error"
            description="Refresh the page or try again in a moment."
            onRetry={() => this.setState({ hasError: false })}
          />
        </main>
      );
    }

    return this.props.children;
  }
}
