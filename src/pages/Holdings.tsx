import { Flex, Table, Typography, Empty } from "antd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, TrendingDown } from "lucide-react";

const { Title, Text } = Typography;

const columns = [
  {
    title: "Symbol",
    dataIndex: "tradingsymbol",
    key: "tradingsymbol",
    width: 180,
    sorter: (a: any, b: any) => a.tradingsymbol.localeCompare(b.tradingsymbol),
  },
  {
    title: "Qty",
    dataIndex: "quantity",
    key: "quantity",
    align: "right" as const,
    width: 80,
    sorter: (a: any, b: any) => a.quantity - b.quantity,
  },
  {
    title: "Avg Cost",
    dataIndex: "average_price",
    key: "average_price",
    align: "right" as const,
    width: 100,
    render: (price: number) => price?.toFixed(2) ?? "—",
    sorter: (a: any, b: any) => a.average_price - b.average_price,
  },
  {
    title: "Current Price",
    dataIndex: "last_price",
    key: "last_price",
    align: "right" as const,
    width: 100,
    render: (price: number) => price?.toFixed(2) ?? "—",
    sorter: (a: any, b: any) => a.last_price - b.last_price,
  },
  {
    title: "Current Value",
    dataIndex: "value",
    key: "value",
    align: "right" as const,
    width: 120,
    render: (value: number) => value?.toFixed(2) ?? "—",
    sorter: (a: any, b: any) => a.value - b.value,
  },
  {
    title: "P&L",
    dataIndex: "pnl",
    key: "pnl",
    align: "right" as const,
    width: 100,
    render: (pnl: number) => (
      <span style={{ color: pnl >= 0 ? "var(--bullish)" : "var(--bearish)" }}>
        {pnl?.toFixed(2) ?? "—"}
      </span>
    ),
    sorter: (a: any, b: any) => a.pnl - b.pnl,
  },
  {
    title: "P&L %",
    dataIndex: "pnl_pct",
    key: "pnl_pct",
    align: "right" as const,
    width: 80,
    render: (pct: number) => (
      <Flex align="center" justify="flex-end" gap={4}>
        {pct >= 0 ? (
          <TrendingUp className="h-3 w-3" style={{ color: "var(--bullish)" }} />
        ) : (
          <TrendingDown className="h-3 w-3" style={{ color: "var(--bearish)" }} />
        )}
        <span style={{ color: pct >= 0 ? "var(--bullish)" : "var(--bearish)" }}>
          {pct?.toFixed(2) ?? "—"}%
        </span>
      </Flex>
    ),
    sorter: (a: any, b: any) => a.pnl_pct - b.pnl_pct,
  },
];

// Define the Holding interface to ensure type safety
interface Holding {
  tradingsymbol: string;
  exchange: string;
  instrument_token: number;
  isin: string;
  product: string;
  price: number; // This seems to be 0 in the example, likely avg cost is what we want
  quantity: number;
  used_quantity: number;
  t1_quantity: number;
  realised_quantity: number;
  authorised_quantity: number;
  authorised_date: string;
  opening_quantity: number;
  short_quantity: number;
  collateral_quantity: number;
  collateral_type: string;
  discrepancy: boolean;
  average_price: number;
  last_price: number;
  close_price: number;
  pnl: number;
  day_change: number;
  day_change_percentage: number;
  mtf: {
    quantity: number;
    used_quantity: number;
    average_price: number;
    value: number;
    initial_margin: number;
  };
  // Derived fields
  value?: number;
  pnl_pct?: number;
}

import { useQueryCall } from "@/Utils/api";
import { useMemo } from "react";

export default function Holdings() {
  const { data, isLoading }:any = useQueryCall(
    ["HOLDINGS_DATA"],
    "GET",
    "HOLDINGS"
  ) as any;

  const holdings = useMemo(() => {
    const rawHoldings: Holding[] = data?.data || [];
    return rawHoldings.map((item) => {
      const value = item.last_price * item.quantity;
      const investment = item.average_price * item.quantity;
      // Protect against division by zero
      const pnl_pct = investment !== 0
        ? ((value - investment) / investment) * 100
        : 0;

      return {
        ...item,
        value,
        pnl_pct,
      };
    });
  }, [data]);

  const summary = useMemo(() => {
    let totalInvestment = 0;
    let currentValue = 0;
    let totalPnl = 0;

    holdings.forEach((h) => {
      totalInvestment += h.average_price * h.quantity;
      currentValue += h.value || 0;
      totalPnl += h.pnl;
    });

    return {
      totalInvestment,
      currentValue,
      totalPnl,
    };
  }, [holdings]);

  return (
    <Flex vertical gap="large">
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Holdings
        </Title>
        <Text type="secondary">Your long-term investment portfolio</Text>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Investment
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{summary.totalInvestment.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{summary.currentValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total P&L
            </CardTitle>
            {summary.totalPnl >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.totalPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
              ₹{summary.totalPnl.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <div className="rounded-lg border bg-card">
        <Table
          dataSource={holdings}
          columns={columns}
          rowKey="tradingsymbol"
          loading={isLoading}
          pagination={false}
          size="middle"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No holdings found. Connect your broker to view holdings."
              />
            ),
          }}
        />
      </div>
    </Flex>
  );
}

