import { useMemo, useState, useEffect, useCallback } from "react";
import { Flex, Table, Typography, Tag, Input, Switch } from "antd";
import { useSSE } from "@/hooks/useSSE";
import type { SSEStatus } from "@/hooks/useSSE";
import { ENDPOINTS } from "@/Utils/endpoints";
import { API } from "@/Utils/api";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wifi, WifiOff, Loader2, Search, Clock } from "lucide-react";

const { Title, Text } = Typography;

function StatusBadge({ status }: { status: SSEStatus }) {
  const config = {
    connecting: {
      color: "processing",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
      text: "Connecting",
    },
    connected: {
      color: "success",
      icon: <Wifi className="h-3 w-3" />,
      text: "Live",
    },
    disconnected: {
      color: "default",
      icon: <WifiOff className="h-3 w-3" />,
      text: "Disconnected",
    },
    error: {
      color: "error",
      icon: <WifiOff className="h-3 w-3" />,
      text: "Error",
    },
  }[status];

  return (
    <Tag color={config.color} className="flex items-center gap-1.5 px-2 py-1">
      {config.icon}
      <span>{config.text}</span>
    </Tag>
  );
}

type DataMode = "sse" | "polling";

export default function LiveLTP() {
  const [searchText, setSearchText] = useState("");
  const [dataMode, setDataMode] = useState<DataMode>("polling");
  const [pollingData, setPollingData] = useState<Map<string, any>>(new Map());
  const [pollingError, setPollingError] = useState<string | null>(null);
  const [pollingStatus, setPollingStatus] = useState<SSEStatus>("disconnected");
  const [lastPollingUpdate, setLastPollingUpdate] = useState<Date | null>(null);

  const {
    data: sseData,
    status: sseStatus,
    error: sseError,
    reconnect,
    disconnect,
  } = useSSE({
    url: ENDPOINTS.SSE_LIVE,
    enabled: dataMode === "sse",
  });
  console.log("🚀 ~ LiveLTP ~ sseData:", sseData);

  // Fetch LTP snapshot data
  const fetchSnapshot = useCallback(async () => {
    try {
      setPollingStatus("connecting");
      setPollingError(null);
      const response = await API.get(ENDPOINTS.LTP_SNAPSHOT);

      const newData = new Map();

      if (Array.isArray(response.data)) {
        // Handle array format
        response.data.forEach((item: any) => {
          const ltp = parseFloat(item.lp || item.ltp || "0");
          const open = parseFloat(item.open || "0");
          const change = ltp - open;
          const changePercent = open !== 0 ? (change / open) * 100 : 0;

          newData.set(item.symbol, {
            symbol: item.symbol,
            ltp,
            change,
            changePercent,
            volume: item.volume || 0,
          });
        });
      } else if (typeof response.data === "object" && response.data !== null) {
        // Handle object format with token IDs as keys (e.g., {"6994": {...}, "26000": {...}})
        Object.values(response.data).forEach((item: any) => {
          if (item.symbol) {
            const ltp = parseFloat(item.lp || item.ltp || "0");
            const open = parseFloat(item.open || "0");
            const change = ltp - open;
            const changePercent = open !== 0 ? (change / open) * 100 : 0;

            newData.set(item.symbol, {
              symbol: item.symbol,
              ltp,
              change,
              changePercent,
              volume: item.volume || 0,
            });
          }
        });
      }

      setPollingData(newData);
      setPollingStatus("connected");
      setLastPollingUpdate(new Date());
    } catch (err: any) {
      setPollingError(err?.message || "Failed to fetch snapshot data");
      setPollingStatus("error");
    }
  }, []);

  // Polling effect
  useEffect(() => {
    if (dataMode !== "polling") {
      return;
    }

    // Fetch immediately when switching to polling mode (async to avoid cascading renders)
    const initialTimeout = setTimeout(() => {
      fetchSnapshot();
    }, 0);

    // Set up 30-second polling
    const intervalId = setInterval(fetchSnapshot, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [dataMode, fetchSnapshot]);

  // Determine active data source
  const data = dataMode === "sse" ? sseData : pollingData;
  const status = dataMode === "sse" ? sseStatus : pollingStatus;
  const error = dataMode === "sse" ? sseError : pollingError;

  const tableData = useMemo(() => {
    const items = Array.from(data.values());
    if (!searchText) return items;
    return items.filter((item) =>
      item.symbol.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      width: 180,
      sorter: (a: any, b: any) => a.symbol.localeCompare(b.symbol),
      render: (symbol: string) => <span className="font-medium">{symbol}</span>,
    },
    {
      title: "LTP",
      dataIndex: "ltp",
      key: "ltp",
      align: "right" as const,
      width: 120,
      sorter: (a: any, b: any) => a.ltp - b.ltp,
      render: (ltp: number) => (
        <span className="font-mono">{ltp?.toFixed(2) ?? "-"}</span>
      ),
    },
    {
      title: "Change",
      dataIndex: "change",
      key: "change",
      align: "right" as const,
      width: 100,
      sorter: (a: any, b: any) => a.change - b.change,
      render: (change: number) => (
        <span
          className="font-mono"
          style={{ color: change >= 0 ? "var(--bullish)" : "var(--bearish)" }}
        >
          {change >= 0 ? "+" : ""}
          {change?.toFixed(2) ?? "-"}
        </span>
      ),
    },
    {
      title: "Change %",
      dataIndex: "changePercent",
      key: "changePercent",
      align: "right" as const,
      width: 100,
      sorter: (a: any, b: any) => a.changePercent - b.changePercent,
      render: (pct: number) => (
        <Tag color={pct >= 0 ? "green" : "red"} className="font-mono">
          {pct >= 0 ? "+" : ""}
          {pct?.toFixed(2) ?? "-"}%
        </Tag>
      ),
    },
    {
      title: "Volume",
      dataIndex: "volume",
      key: "volume",
      align: "right" as const,
      width: 120,
      sorter: (a: any, b: any) => a.volume - b.volume,
      render: (volume: number) => (
        <span className="font-mono text-muted-foreground">
          {volume?.toLocaleString() ?? "-"}
        </span>
      ),
    },
  ];

  const handleModeToggle = (checked: boolean) => {
    setDataMode(checked ? "polling" : "sse");
    if (!checked) {
      // Switching to SSE, disconnect polling
      setPollingData(new Map());
      setPollingError(null);
      setPollingStatus("disconnected");
    } else {
      // Switching to polling, disconnect SSE
      disconnect();
    }
  };

  const handleManualRefresh = () => {
    if (dataMode === "polling") {
      fetchSnapshot();
    } else {
      reconnect();
    }
  };

  return (
    <Flex vertical gap="large">
      <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
        <Flex align="center" gap="middle">
          <Title level={2} style={{ margin: 0 }}>
            Live Market Data
          </Title>
          <StatusBadge status={status} />
        </Flex>

        <Flex gap="middle" align="center" wrap="wrap">
          <Flex align="center" gap="small">
            <Wifi className="h-4 w-4" />
            <Text>SSE</Text>
            <Switch
              checked={dataMode === "polling"}
              onChange={handleModeToggle}
              style={{ margin: "0 4px" }}
            />
            <Clock className="h-4 w-4" />
            <Text>Polling (30s)</Text>
          </Flex>

          <Input
            placeholder="Search symbol..."
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />

          {dataMode === "sse" ? (
            status === "connected" ? (
              <Button variant="outline" size="sm" onClick={disconnect}>
                <WifiOff className="h-4 w-4 mr-1" />
                Disconnect
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={reconnect}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Reconnect
              </Button>
            )
          ) : (
            <Button variant="outline" size="sm" onClick={handleManualRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Now
            </Button>
          )}
        </Flex>
      </Flex>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
          <Text type="danger">{error}</Text>
        </div>
      )}

      <div className="rounded-lg border bg-card">
        <Table
          dataSource={tableData}
          columns={columns}
          rowKey="symbol"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} symbols`,
          }}
          size="middle"
          scroll={{ x: 600 }}
          locale={{
            emptyText:
              status === "connecting"
                ? "Connecting to live feed..."
                : status === "connected"
                ? "Waiting for data..."
                : "No data available. Click reconnect to start.",
          }}
        />
      </div>

      <Flex justify="space-between" className="text-muted-foreground text-sm">
        <span>
          {tableData.length} symbol{tableData.length !== 1 ? "s" : ""} displayed
        </span>
        <span>
          {dataMode === "sse"
            ? "Data updates in real-time via SSE"
            : lastPollingUpdate
            ? `Last updated: ${lastPollingUpdate.toLocaleTimeString()} (refreshes every 30s)`
            : "Polling every 30 seconds"}
        </span>
      </Flex>
    </Flex>
  );
}
