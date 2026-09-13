import { Component, ReactNode } from "react";
import { useNavigate } from "react-router";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryWrapper error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

function ErrorBoundaryWrapper({ error, errorInfo }: { error?: Error; errorInfo?: React.ErrorInfo }) {
  const navigate = useNavigate();

  // Store error in sessionStorage and redirect to error page
  const errorData = {
    status: 500,
    message: error?.message || "An unexpected error occurred",
    data: {
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
    },
  };

  sessionStorage.setItem("errorData", JSON.stringify(errorData));
  navigate("/error");

  return null;
}

export default ErrorBoundary;
