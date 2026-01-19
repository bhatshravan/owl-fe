import { useState, useMemo } from "react";
import { Flex, Result, Table, Typography, Input, Empty } from "antd";
import { useQueryCall } from "@/Utils/api";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  Briefcase
} from "lucide-react";

const { Title, Text } = Typography;

export default function Positions() {
  const [searchText, setSearchText] = useState("");

  // Fetch positions data
  const positions = useQueryCall("positions", "get", "POSITIONS", {});
  const { data, refetch, isFetching }: any = positions;

  // Extract net positions
  const netPositions = useMemo(() => data?.data?.net || [], [data]);

  // Filter positions based on search text
  const filteredPositions = useMemo(() => {
    if (!searchText) return netPositions;
    return netPositions.filter((item: any) =>
      item.tradingsymbol.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [netPositions, searchText]);

  // Calculate summary stats
  const stats = useMemo(() => {
    return netPositions.reduce(
      (acc: any, curr: any) => ({
        totalPnl: acc.totalPnl + (curr.pnl || 0),
        totalM2m: acc.totalM2m + (curr.m2m || 0),
        totalValue: acc.totalValue + (curr.value || 0),
      }),
      { totalPnl: 0, totalM2m: 0, totalValue: 0 }
    );
  }, [netPositions]);

  if (positions.error) {
    return (
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Result
          status="error"
          title="Failed to load positions"
          subTitle={positions.error.message || "Something went wrong"}
          extra={
            <Button onClick={() => refetch()}>Try Again</Button>
          }
        />
      </Flex>
    );
  }

  if (positions.isLoading) {
    return (
      <Flex vertical align="center" justify="center" style={{ minHeight: "400px" }}>
        <Spinner />
      </Flex>
    );
  }

  const columns = [
    {
      title: "Symbol",
      dataIndex: "tradingsymbol",
      key: "tradingsymbol",
      width: 180,
      sorter: (a: any, b: any) => a.tradingsymbol.localeCompare(b.tradingsymbol),
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      align: "right" as const,
      width: 80,
      sorter: (a: any, b: any) => a.quantity - b.quantity,
      render: (qty: number) => (
        <span className={qty < 0 ? "text-red-500" : "text-green-500"}>
          {qty}
        </span>
      ),
    },
    {
      title: "Avg Price",
      dataIndex: "average_price",
      key: "average_price",
      align: "right" as const,
      width: 100,
      render: (price: number) => price.toFixed(2),
      sorter: (a: any, b: any) => a.average_price - b.average_price,
    },
    {
      title: "Last Price",
      dataIndex: "last_price",
      key: "last_price",
      align: "right" as const,
      width: 100,
      render: (price: number) => price.toFixed(2),
      sorter: (a: any, b: any) => a.last_price - b.last_price,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      align: "right" as const,
      width: 120,
      render: (value: number) => value.toFixed(2),
      sorter: (a: any, b: any) => a.value - b.value,
    },
    {
      title: "P&L",
      dataIndex: "pnl",
      key: "pnl",
      align: "right" as const,
      width: 120,
      render: (pnl: number) => (
        <span style={{ color: pnl >= 0 ? "var(--bullish)" : "var(--bearish)" }} className="font-medium">
          {pnl.toFixed(2)}
        </span>
      ),
      sorter: (a: any, b: any) => a.pnl - b.pnl,
    },
    {
      title: "M2M",
      dataIndex: "m2m",
      key: "m2m",
      align: "right" as const,
      width: 120,
      render: (m2m: number) => (
        <Flex align="center" justify="flex-end" gap={4}>
          {m2m >= 0 ? (
            <TrendingUp className="h-3 w-3" style={{ color: "var(--bullish)" }} />
          ) : (
            <TrendingDown className="h-3 w-3" style={{ color: "var(--bearish)" }} />
          )}
          <span style={{ color: m2m >= 0 ? "var(--bullish)" : "var(--bearish)" }} className="font-medium">
            {m2m.toFixed(2)}
          </span>
        </Flex>
      ),
      sorter: (a: any, b: any) => a.m2m - b.m2m,
    },
  ];

  return (
    <Flex vertical gap="large">
      <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Positions
          </Title>
          <Text type="secondary">Manage your open derivatives and intraday positions</Text>
        </div>

        <Flex gap="middle" align="center">
          <Input
            placeholder="Search symbol..."
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </Flex>
      </Flex>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total P&L
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalPnl >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.totalPnl >= 0 ? "+" : ""}{stats.totalPnl.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total M2M
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalM2m >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.totalM2m >= 0 ? "+" : ""}{stats.totalM2m.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Realized + Unrealized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Market Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current exposure
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card">
        <Table
          pagination={false}
          dataSource={filteredPositions}
          columns={columns}
          rowKey="tradingsymbol"
          size="middle"
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={searchText ? "No positions match your search" : "No open positions found"}
              />
            ),
          }}
        />
      </div>

      <div className="text-muted-foreground text-sm">
        {filteredPositions.length} position{filteredPositions.length !== 1 ? "s" : ""} open
      </div>
    </Flex>
  );
}
