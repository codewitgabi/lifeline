import { Component, type ErrorInfo, type ReactNode } from "react";
import { Droplets, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: "#FBF8F6" }}
      >
        <span
          className="flex items-center justify-center w-16 h-16 rounded-[18px] mb-6"
          style={{ background: "#F7E9EB", border: "1px solid #EBD9DC" }}
        >
          <Droplets className="w-8 h-8" style={{ color: "#C8102E" }} />
        </span>

        <h1
          className="font-display font-semibold mb-2"
          style={{ fontSize: "clamp(22px, 3vw, 28px)", color: "#231518", letterSpacing: "-0.015em" }}
        >
          Something went wrong
        </h1>
        <p className="text-[15px] mb-2 max-w-sm" style={{ color: "#6E5A5E" }}>
          An unexpected error occurred. You can try refreshing the page.
        </p>

        {import.meta.env.DEV && (
          <pre
            className="text-left text-[11px] rounded-[10px] px-4 py-3 mb-6 max-w-lg w-full overflow-auto"
            style={{ background: "#F7E9EB", border: "1px solid #EBD9DC", color: "#C8102E" }}
          >
            {this.state.error.message}
          </pre>
        )}

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-full text-white transition-all hover:-translate-y-px"
            style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh page
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:-translate-y-px"
            style={{ background: "#fff", color: "#231518", border: "1px solid #EBD9DC", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}
          >
            Go home
          </button>
        </div>
      </div>
    );
  }
}
