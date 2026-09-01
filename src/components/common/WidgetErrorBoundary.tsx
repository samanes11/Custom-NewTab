import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  label: string;
}

interface State {
  hasError: boolean;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[DevTab] ${this.props.label} widget crashed:`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="widget-card animate-fade-in items-center justify-center gap-2 py-8 text-center">
          <AlertTriangle className="h-5 w-5 text-bad" />
          <p className="text-sm text-ink-dim">{this.props.label} couldn't be displayed.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
