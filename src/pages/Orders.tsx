import { Flex, Table, Typography, Empty, Tag } from "antd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const { Title, Text } = Typography;

const columns = [
  {
    title: "Order ID",
    dataIndex: "order_id",
    key: "order_id",
    width: 140,
  },
  {
    title: "Symbol",
    dataIndex: "tradingsymbol",
    key: "tradingsymbol",
    width: 150,
    sorter: (a: any, b: any) => a.tradingsymbol.localeCompare(b.tradingsymbol),
  },
  {
    title: "Type",
    dataIndex: "transaction_type",
    key: "transaction_type",
    width: 80,
    render: (type: string) => (
      <Tag color={type === "BUY" ? "green" : "red"}>{type}</Tag>
    ),
  },
  {
    title: "Product",
    dataIndex: "product",
    key: "product",
    width: 80,
  },
  {
    title: "Qty",
    dataIndex: "quantity",
    key: "quantity",
    align: "right" as const,
    width: 80,
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    align: "right" as const,
    width: 100,
    render: (price: number) => price?.toFixed(2) ?? "—",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status: string) => {
      const config: Record<string, { color: string; icon: React.ReactNode }> = {
        COMPLETE: { color: "success", icon: <CheckCircle className="h-3 w-3" /> },
        REJECTED: { color: "error", icon: <XCircle className="h-3 w-3" /> },
        PENDING: { color: "processing", icon: <Clock className="h-3 w-3" /> },
        OPEN: { color: "warning", icon: <Clock className="h-3 w-3" /> },
      };
      const cfg = config[status] || { color: "default", icon: null };
      return (
        <Tag color={cfg.color} className="flex items-center gap-1 w-fit">
          {cfg.icon}
          {status}
        </Tag>
      );
    },
  },
  {
    title: "Time",
    dataIndex: "order_timestamp",
    key: "order_timestamp",
    width: 160,
    sorter: (a: any, b: any) =>
      new Date(a.order_timestamp).getTime() - new Date(b.order_timestamp).getTime(),
  },
];

interface Order {
  account_id: string;
  order_id: string;
  exchange_order_id: string;
  parent_order_id: string | null;
  status: string;
  status_message: string | null;
  order_timestamp: string;
  exchange: string;
  tradingsymbol: string;
  instrument_token: number;
  order_type: string;
  transaction_type: string;
  validity: string;
  product: string;
  quantity: number;
  price: number;
  average_price: number;
  filled_quantity: number;
  pending_quantity: number;
  cancelled_quantity: number;
  market_protection: number;
}

import { useQueryCall } from "@/Utils/api";
import { useMemo } from "react";

export default function Orders() {
  const { data, isLoading } = useQueryCall(
    ["ORDERS_DATA"],
    "GET",
    "ORDERS"
  ) as any;

  const orders: Order[] = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const summary = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc.total++;
        if (order.status === "COMPLETE") acc.completed++;
        else if (order.status === "REJECTED" || order.status === "CANCELLED") acc.rejected++;
        else if (order.status === "OPEN" || order.status === "PENDING" || order.status === "TRIGGER PENDING") acc.pending++;
        return acc;
      },
      { total: 0, completed: 0, rejected: 0, pending: 0 }
    );
  }, [orders]);

  return (
    <Flex vertical gap="large">
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Orders
        </Title>
        <Text type="secondary">Track your order history and status</Text>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border bg-card">
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="order_id"
          loading={isLoading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
          }}
          size="middle"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No orders found. Place an order to see it here."
              />
            ),
          }}
        />
      </div>
    </Flex>
  );
}

