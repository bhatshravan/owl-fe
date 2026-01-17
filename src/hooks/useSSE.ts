import { useEffect, useRef, useState, useCallback } from "react";

type SSEStatusType = "connecting" | "connected" | "disconnected" | "error";

export type { SSEStatusType as SSEStatus };

export interface LTPData {
  symbol: string;
  ltp: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

interface UseSSEOptions {
  url: string;
  enabled?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseSSEReturn {
  data: Map<string, LTPData>;
  status: SSEStatusType;
  error: string | null;
  reconnect: () => void;
  disconnect: () => void;
}

export function useSSE({
  url,
  enabled = true,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseSSEOptions): UseSSEReturn {
  const [data, setData] = useState<Map<string, LTPData>>(new Map());
  const [status, setStatus] = useState<SSEStatusType>(
    enabled ? "connecting" : "disconnected"
  );
  const [error, setError] = useState<string | null>(null);
  const [connectionTrigger, setConnectionTrigger] = useState(0);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isManualDisconnectRef = useRef(false);

  const disconnect = useCallback(() => {
    isManualDisconnectRef.current = true;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    reconnectAttemptsRef.current = maxReconnectAttempts;
    setStatus("disconnected");
  }, [maxReconnectAttempts]);

  const reconnect = useCallback(() => {
    isManualDisconnectRef.current = false;
    reconnectAttemptsRef.current = 0;
    setStatus("connecting");
    setConnectionTrigger((n) => n + 1);
  }, []);

  useEffect(() => {
    // Skip if not enabled or manually disconnected
    if (!enabled || isManualDisconnectRef.current) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    // Skip if already connected
    if (eventSourceRef.current) {
      return;
    }

    const token = localStorage.getItem("Auth");
    const sseUrl = token ? `${url}?token=${token}` : url;

    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setStatus("connected");
      setError(null);
      reconnectAttemptsRef.current = 0;
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (Array.isArray(parsed)) {
          setData((prev) => {
            const newMap = new Map(prev);
            parsed.forEach((item: LTPData) => {
              if (item.symbol) {
                newMap.set(item.symbol, {
                  ...item,
                  timestamp: item.timestamp || Date.now(),
                });
              }
            });
            return newMap;
          });
        } else if (parsed.symbol) {
          setData((prev) => {
            const newMap = new Map(prev);
            newMap.set(parsed.symbol, {
              ...parsed,
              timestamp: parsed.timestamp || Date.now(),
            });
            return newMap;
          });
        }
      } catch {
        console.error("Failed to parse SSE message");
      }
    };

    eventSource.onerror = () => {
      setStatus("error");
      eventSource.close();
      eventSourceRef.current = null;

      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        setError(
          `Connection lost. Reconnecting (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`
        );
        reconnectTimeout = setTimeout(() => {
          setStatus("connecting");
          setConnectionTrigger((n) => n + 1);
        }, reconnectInterval);
      } else {
        setError("Connection failed. Max reconnection attempts reached.");
        setStatus("disconnected");
      }
    };

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [
    enabled,
    url,
    reconnectInterval,
    maxReconnectAttempts,
    connectionTrigger,
  ]);

  // Derive effective status based on enabled prop
  const effectiveStatus = !enabled ? "disconnected" : status;

  return { data, status: effectiveStatus, error, reconnect, disconnect };
}
