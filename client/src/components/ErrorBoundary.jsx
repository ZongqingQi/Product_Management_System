import React from "react";
import "../styles/ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 更新 state，下次渲染时显示错误 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 可以将错误记录到错误报告服务
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReset = () => {
    // 重置错误状态
    this.setState({ hasError: false, error: null, errorInfo: null });
    // 刷新页面
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // 错误 UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <h1 className="error-title">Oops! Something went wrong</h1>
            <p className="error-message">
              We're sorry, but something unexpected happened. Please try again.
            </p>

            {/* 显示错误详情（仅在开发环境） */}
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

    // 正常情况下渲染子组件
    return this.props.children;
  }
}

export default ErrorBoundary;
