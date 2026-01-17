import { useMemo, useState } from "react";
import { Flex, Table, Typography, Tag, Input } from "antd";
import { useSSE } from "@/hooks/useSSE";
import type { SSEStatus } from "@/hooks/useSSE";
import { ENDPOINTS } from "@/Utils/endpoints";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wifi, WifiOff, Loader2, Search } from "lucide-react";

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

export default function LiveLTP() {
  const [searchText, setSearchText] = useState("");
  const { data, status, error, reconnect, disconnect } = useSSE({
    url: ENDPOINTS.SSE_LIVE,
    enabled: true,
  });

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

  return (
    <Flex vertical gap="large">
      <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
        <Flex align="center" gap="middle">
          <Title level={2} style={{ margin: 0 }}>
            Live Market Data
          </Title>
          <StatusBadge status={status} />
        </Flex>

        <Flex gap="small" align="center">
          <Input
            placeholder="Search symbol..."
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          {status === "connected" ? (
            <Button variant="outline" size="sm" onClick={disconnect}>
              <WifiOff className="h-4 w-4 mr-1" />
              Disconnect
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={reconnect}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Reconnect
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
        <span>Data updates in real-time via SSE</span>
      </Flex>
    </Flex>
  );
}
