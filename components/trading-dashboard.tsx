"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { FeedCard } from "./components/feed-card";

// Mock data - replace with API data in production
const priceData = [
  { timestamp: "2024-01-01", price: 0.02446, volume: 1000000 },
  { timestamp: "2024-01-02", price: 0.025, volume: 1200000 },
  { timestamp: "2024-01-03", price: 0.0255, volume: 1500000 },
  { timestamp: "2024-01-04", price: 0.026, volume: 1300000 },
  { timestamp: "2024-01-05", price: 0.0265, volume: 1800000 },
];

const trades = [
  {
    id: 1,
    user: "eth_eth",
    avatar: "/placeholder.svg",
    bio: "Full-time crypto trader",
    amount: "$2.3K",
    timestamp: "2024-01-01 14:30",
    type: "buy",
  },
  {
    id: 2,
    user: "bob_trader",
    avatar: "/placeholder.svg",
    bio: "DeFi enthusiast",
    amount: "$1.8K",
    timestamp: "2024-01-01 15:45",
    type: "sell",
  },
];

export default function Component() {
  const [filteredUser, setFilteredUser] = useState<string | null>(null);

  const handleFilterClick = (user: string) => {
    setFilteredUser((prevUser) => (prevUser === user ? null : user));
  };

  const filteredTrades = filteredUser
    ? trades.filter((trade) => trade.user === filteredUser)
    : trades;

  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" alt="Token" />
            <AvatarFallback>TK</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">$TOKEN</h1>
            <div className="flex items-center gap-2">
              <span className="text-xl">$0.02446</span>
              <span className="text-green-500">+112%</span>
            </div>
          </div>
        </div>
        <Tabs defaultValue="1d" className="w-[300px]">
          <TabsList>
            <TabsTrigger value="1d">1D</TabsTrigger>
            <TabsTrigger value="3d">3D</TabsTrigger>
            <TabsTrigger value="7d">7D</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                price: {
                  label: "Price",
                  color: "hsl(var(--primary))",
                },
                volume: {
                  label: "Volume",
                  color: "hsl(var(--muted))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="price"
                    stroke="var(--color-price)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="volume"
                    stroke="var(--color-volume)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <FeedCard trades={filteredTrades} onFilterClick={handleFilterClick} />
      </div>
    </div>
  );
}
