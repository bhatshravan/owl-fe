import { Flex, Typography } from "antd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  Activity,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const quickStats = [
  {
    title: "Total P&L",
    value: "—",
    change: null,
    icon: DollarSign,
    description: "Today's profit/loss",
  },
  {
    title: "Open Positions",
    value: "—",
    change: null,
    icon: Briefcase,
    description: "Active trades",
  },
  {
    title: "Holdings Value",
    value: "—",
    change: null,
    icon: BarChart3,
    description: "Portfolio value",
  },
  {
    title: "Market Status",
    value: "—",
    change: null,
    icon: Activity,
    description: "NSE/BSE status",
  },
];

const quickLinks = [
  {
    title: "Live Market",
    description: "Real-time stock prices",
    href: "/live",
    icon: TrendingUp,
  },
  {
    title: "Positions",
    description: "View open positions",
    href: "/positions",
    icon: Briefcase,
  },
  {
    title: "Analytics",
    description: "Usage statistics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function Dashboard() {
  return (
    <Flex vertical gap="large">
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Dashboard
        </Title>
        <Text type="secondary">Welcome back to Owl Trading</Text>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.change !== null && (
                <div
                  className={`flex items-center text-xs mt-2 ${
                    stat.change >= 0 ? "text-bullish" : "text-bearish"
                  }`}
                >
                  {stat.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span>
                    {stat.change >= 0 ? "+" : ""}
                    {stat.change}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <Title level={4} style={{ marginBottom: 16 }}>
          Quick Access
        </Title>
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <link.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Connect to Live Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Head over to the <Link to="/live" className="text-primary hover:underline">Live LTP</Link> page 
                to see real-time market data streaming via SSE. Your dashboard will show live stats once connected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Flex>
  );
}

