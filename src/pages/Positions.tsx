import { Flex, Result, Table, Typography } from "antd";
import { useQueryCall } from "@/Utils/api";
import { Spinner } from "@/components/ui/spinner";
export default function Positions() {

  const positions = useQueryCall("positions", "get", "POSITIONS", {});
  const { data: rawData }: any = positions;
  const { data }: any = rawData;
  const { Title } = Typography;

  if(positions.error){
    return (
      <Result status={"error"} title="Something went wrong" />
    )
  }
  if (positions.isLoading) {
    return (
      <Flex vertical align="center" justify="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Flex vertical align="center" justify="center" gap={"large"}>
      <Title level={2}>Positions</Title>
      <Table
        pagination={false}
        dataSource={data.data?.net || []}
        columns={[
          {
            title: "Symbol",
            dataIndex: "tradingsymbol",
            key: "tradingsymbol",
            width: 180,
            sorter: (a: any, b: any) =>
              a.tradingsymbol.localeCompare(b.tradingsymbol),
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
            width: 100,
            render: (value: number) => value.toFixed(2),
            sorter: (a: any, b: any) => a.value - b.value,
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
            sorter: (a: any, b: any) => a.pnl - b.pnl,
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
            sorter: (a: any, b: any) => a.m2m - b.m2m,
          },
        ]}
      />
    </Flex>
  );
}
