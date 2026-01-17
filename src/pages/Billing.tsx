import { Flex, Typography, Empty } from "antd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Package, Calendar, CheckCircle } from "lucide-react";

const { Title, Text } = Typography;

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: [
      "100 API calls/day",
      "Basic market data",
      "Email support",
    ],
    current: true,
  },
  {
    name: "Starter",
    price: "₹499",
    period: "month",
    features: [
      "1,000 API calls/day",
      "Real-time market data",
      "Priority support",
      "Webhooks",
    ],
    current: false,
  },
  {
    name: "Pro",
    price: "₹1,999",
    period: "month",
    features: [
      "10,000 API calls/day",
      "Historical data access",
      "Advanced analytics",
      "Dedicated support",
      "Custom integrations",
    ],
    current: false,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Unlimited API calls",
      "White-label options",
      "SLA guarantee",
      "Dedicated account manager",
      "Custom development",
    ],
    current: false,
  },
];

export default function Billing() {
  return (
    <Flex vertical gap="large">
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Billing
        </Title>
        <Text type="secondary">Manage your subscription and payment methods</Text>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Flex justify="space-between" align="center">
            <div>
              <div className="text-2xl font-bold">Free Plan</div>
              <Text type="secondary">100 API calls per day</Text>
            </div>
            <Button>Upgrade Plan</Button>
          </Flex>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div>
        <Title level={4} style={{ marginBottom: 16 }}>
          Available Plans
        </Title>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">/{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-bullish" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No payment methods added"
          >
            <Button variant="outline">Add Payment Method</Button>
          </Empty>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No billing history yet"
          />
        </CardContent>
      </Card>
    </Flex>
  );
}

