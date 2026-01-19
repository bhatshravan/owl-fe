import { Button, Card, Flex, Form, Input, Typography, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { API } from "@/Utils/api";
import { ENDPOINTS } from "@/Utils/endpoints";

interface KiteCredentials {
  apiKey: string;
  apiSecret: string;
  userId: string;
}

export default function Manage() {
  const { Title, Text } = Typography;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const KITE_LOGIN_URL =
    "https://kite.zerodha.com/connect/login?api_key=kxttmze3myz7kwxi&v=3";

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<KiteCredentials>({
    defaultValues: {
      apiKey: "",
      apiSecret: "",
      userId: "",
    },
  });

  const onSubmit = async (data: KiteCredentials) => {
    setLoading(true);
    try {
      await API.post(ENDPOINTS.KITE_CREDENTIALS, data);
      message.success("Kite credentials saved successfully!");
    } catch (error) {
      message.error("Failed to save Kite credentials");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCredentials = async () => {
    setFetching(true);
    try {
      const { data } = await API.get(ENDPOINTS.KITE_CREDENTIALS);
      if (data) {
        setValue("apiKey", data.apiKey || "");
        setValue("apiSecret", data.apiSecret || "");
        setValue("userId", data.userId || "");
        message.success("Credentials loaded successfully!");
      }
    } catch (error) {
      message.error("Failed to fetch Kite credentials");
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  return (
    <Flex vertical align="center" justify="center" gap={"large"} style={{ padding: 24 }}>
      <Title level={2}>Manage</Title>

      {/* Kite (Zerodha) Section */}
      <Card title="Kite (Zerodha)" style={{ width: "100%", maxWidth: 500 }}>
        <Flex vertical gap={16}>
          <Flex vertical gap={8} align="center">
            <Text type="secondary">Connect your Zerodha Kite account</Text>
            <Button type="primary" href={KITE_LOGIN_URL} target="_blank">
              Kite Login
            </Button>
          </Flex>

          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item
              label="API Key"
              validateStatus={errors.apiKey ? "error" : ""}
              help={errors.apiKey?.message}
            >
              <Controller
                name="apiKey"
                control={control}
                rules={{ required: "API Key is required" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter Kite API Key" />
                )}
              />
            </Form.Item>

            <Form.Item
              label="API Secret"
              validateStatus={errors.apiSecret ? "error" : ""}
              help={errors.apiSecret?.message}
            >
              <Controller
                name="apiSecret"
                control={control}
                rules={{ required: "API Secret is required" }}
                render={({ field }) => (
                  <Input.Password {...field} placeholder="Enter Kite API Secret" />
                )}
              />
            </Form.Item>

            <Form.Item
              label="User ID"
              validateStatus={errors.userId ? "error" : ""}
              help={errors.userId?.message}
            >
              <Controller
                name="userId"
                control={control}
                rules={{ required: "User ID is required" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter Kite User ID" />
                )}
              />
            </Form.Item>

            <Flex gap={12} justify="center">
              <Button onClick={fetchCredentials} loading={fetching}>
                Get Credentials
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Set Credentials
              </Button>
            </Flex>
          </Form>
        </Flex>
      </Card>

      {/* Shoonya Websocket Section */}
      <Card title="Shoonya Websocket" style={{ width: "100%", maxWidth: 500 }}>
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
