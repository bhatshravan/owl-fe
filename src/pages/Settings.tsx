import { Flex, Typography, Input, Switch } from "antd";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings as SettingsIcon,
  Key,
  Bell,
  Shield,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

const { Title, Text } = Typography;

export default function Settings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  return (
    <Flex vertical gap="large">
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Settings
        </Title>
        <Text type="secondary">Manage your account and API settings</Text>
      </div>

      {/* API Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Credentials
          </CardTitle>
          <CardDescription>
            Use these credentials to authenticate API requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">API Key</label>
            <Flex gap="small">
              <Input.Password
                value="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                readOnly
                visibilityToggle={{
                  visible: showApiKey,
                  onVisibleChange: setShowApiKey,
                }}
                iconRender={(visible) =>
                  visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )
                }
                style={{ flex: 1 }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard("api-key")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </Flex>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">API Secret</label>
            <Flex gap="small">
              <Input.Password
                value="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                readOnly
                visibilityToggle={{
                  visible: showApiSecret,
                  onVisibleChange: setShowApiSecret,
                }}
                iconRender={(visible) =>
                  visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )
                }
                style={{ flex: 1 }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard("api-secret")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </Flex>
          </div>

          <Button variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate API Credentials
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Flex justify="space-between" align="center">
            <div>
              <div className="font-medium">Email Notifications</div>
              <Text type="secondary" className="text-sm">
                Receive important updates via email
              </Text>
            </div>
            <Switch defaultChecked />
          </Flex>

          <Flex justify="space-between" align="center">
            <div>
              <div className="font-medium">Order Alerts</div>
              <Text type="secondary" className="text-sm">
                Get notified when orders are executed
              </Text>
            </div>
            <Switch defaultChecked />
          </Flex>

          <Flex justify="space-between" align="center">
            <div>
              <div className="font-medium">Price Alerts</div>
              <Text type="secondary" className="text-sm">
                Receive alerts for price movements
              </Text>
            </div>
            <Switch />
          </Flex>

          <Flex justify="space-between" align="center">
            <div>
              <div className="font-medium">API Usage Alerts</div>
              <Text type="secondary" className="text-sm">
                Alert when approaching usage limits
              </Text>
            </div>
            <Switch defaultChecked />
          </Flex>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Flex justify="space-between" align="center">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <Text type="secondary" className="text-sm">
                Add an extra layer of security
              </Text>
            </div>
            <Button variant="outline">Enable</Button>
          </Flex>

          <Flex justify="space-between" align="center">
            <div>
              <div className="font-medium">Session Management</div>
              <Text type="secondary" className="text-sm">
                View and manage active sessions
              </Text>
            </div>
            <Button variant="outline">Manage</Button>
          </Flex>

          <Flex justify="space-between" align="center">
            <div>
              <div className="font-medium">Change Password</div>
              <Text type="secondary" className="text-sm">
                Update your account password
              </Text>
            </div>
            <Button variant="outline">Change</Button>
          </Flex>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Preferences
          </CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Flex justify="space-between" align="center">
            <div>
              <div className="font-medium">Compact Mode</div>
              <Text type="secondary" className="text-sm">
                Show more data in less space
              </Text>
            </div>
            <Switch />
          </Flex>

          <Flex justify="space-between" align="center">
            <div>
              <div className="font-medium">Show Tooltips</div>
              <Text type="secondary" className="text-sm">
                Display helpful hints and tips
              </Text>
            </div>
            <Switch defaultChecked />
          </Flex>
        </CardContent>
      </Card>
    </Flex>
  );
}
