import { Flex, Table } from "antd";
import { useQueryCall } from "@/Utils/api";
import { Spinner } from "@/components/ui/spinner";
export default function Positions() {
  const positions = useQueryCall("positions", "get", "POSITIONS", {});
  const { data }: any = positions;

  if (positions.isLoading) {
    return (
      <Flex vertical align="center" justify="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Flex vertical align="center" justify="center">
      <Table
        dataSource={data?.data?.net || []}
        columns={[
          {
            title: "Symbol",
            dataIndex: "tradingsymbol",
            key: "tradingsymbol",
            width: 180,
          },
          {
            title: "Qty",
            dataIndex: "quantity",
            key: "quantity",
            align: "right" as const,
            width: 80,
          },
          {
            title: "Avg Price",
            dataIndex: "average_price",
            key: "average_price",
            align: "right" as const,
            width: 100,
            render: (price: number) => price.toFixed(2),
          },
          {
            title: "Last Price",
            dataIndex: "last_price",
            key: "last_price",
            align: "right" as const,
            width: 100,
            render: (price: number) => price.toFixed(2),
          },
          {
            title: "Value",
            dataIndex: "value",
            key: "value",
            align: "right" as const,
            width: 100,
            render: (value: number) => value.toFixed(2),
          },
          {
            title: "P&L",
            dataIndex: "pnl",
            key: "pnl",
            align: "right" as const,
            width: 100,
            render: (pnl: number) => (
              <span style={{ color: pnl >= 0 ? "green" : "red" }}>
                {pnl.toFixed(2)}
              </span>
            ),
          },
          {
            title: "M2M",
            dataIndex: "m2m",
            key: "m2m",
            align: "right" as const,
            width: 100,
            render: (m2m: number) => (
              <span style={{ color: m2m >= 0 ? "green" : "red" }}>
                {m2m.toFixed(2)}
              </span>
            ),
          },
        ]}
      />
    </Flex>
  );
}
