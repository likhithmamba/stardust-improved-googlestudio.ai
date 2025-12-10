

type EventType = 
  | 'feature_toggled' 
  | 'mode_changed' 
  | 'action_performed' 
  | 'error_occurred'
  | 'system_event';

interface TelemetryEvent {
  event: EventType;
  properties: Record<string, any>;
  timestamp: number;
}

class TelemetryService {
  private queue: TelemetryEvent[] = [];
  // Cast import.meta to any to avoid "Property 'env' does not exist on type 'ImportMeta'"
  private isDev = (import.meta as any).env?.DEV;

  public track(event: EventType, properties: Record<string, any> = {}) {
    const payload: TelemetryEvent = {
      event,
      properties,
      timestamp: Date.now(),
    };

    this.queue.push(payload);

    if (this.isDev) {
      console.groupCollapsed(`[Telemetry] ${event}`);
      console.log(properties);
      console.groupEnd();
    }

    // In a real production app, you would batch send these to a backend here.
    // this.flush(); 
  }

  public trackFeatureToggle(feature: string, enabled: boolean) {
    this.track('feature_toggled', { feature, enabled });
  }

  public trackModeChange(from: string, to: string) {
    this.track('mode_changed', { from, to });
  }

  public trackError(source: string, error: any) {
    this.track('error_occurred', { source, message: error.message || String(error) });
  }
}

export const telemetry = new TelemetryService();
