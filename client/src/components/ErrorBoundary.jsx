import React from "react";
import "../styles/ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to display error UI on next render
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReset = () => {
    // Reset error state
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Navigate to home page
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Error UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <h1 className="error-title">Oops! Something went wrong</h1>
            <p className="error-message">
              We're sorry, but something unexpected happened. Please try again.
            </p>

            {/* Show error details in development only */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button className="error-btn-primary" onClick={this.handleReset}>
                Go to Home
              </button>
              <button
                className="error-btn-secondary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
