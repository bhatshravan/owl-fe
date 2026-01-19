import { Button, Card, Flex, Typography } from "antd";

export default function Manage() {
  const { Title, Text } = Typography;

  const KITE_LOGIN_URL =
    "https://kite.zerodha.com/connect/login?api_key=kxttmze3myz7kwxi&v=3";

  return (
    <Flex vertical align="center" justify="center" gap={"large"} style={{ padding: 24 }}>
      <Title level={2}>Manage</Title>

      {/* Kite (Zerodha) Section */}
      <Card title="Kite (Zerodha)" style={{ width: "100%", maxWidth: 400 }}>
        <Flex vertical gap={12} align="center">
          <Text type="secondary">Connect your Zerodha Kite account</Text>
          <Button type="primary" href={KITE_LOGIN_URL} target="_blank">
            Kite Login
          </Button>
        </Flex>
      </Card>

      {/* Shoonya Websocket Section */}
      <Card title="Shoonya Websocket" style={{ width: "100%", maxWidth: 400 }}>
        <Flex vertical gap={12} align="center">
          <Text type="secondary">Control Shoonya websocket connection</Text>
          <Flex gap={12} wrap="wrap" justify="center">
            <Button type="primary">Websocket Start</Button>
            <Button>Websocket Restart</Button>
            <Button danger>Websocket Stop</Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
