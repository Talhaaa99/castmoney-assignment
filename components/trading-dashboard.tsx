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
import { FeedCard } from "./feed-card";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const [filteredUser, setFilteredUser] = useState<string | null>(null);
  const { priceData, trades, loading, error } = useDashboardData();

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
          <Avatar className="h-12 w-12 bg-secondary shadow-lg">
            <AvatarImage src="/placeholder.svg" alt="Token" />
            <AvatarFallback>TK</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-primary">$TOKEN</h1>
            <div className="flex items-center gap-2">
              <span className="text-xl text-muted-foreground">$0.02446</span>
              <span className="text-green-500">+112%</span>
            </div>
          </div>
        </div>
        <Tabs defaultValue="1d" className="w-[300px]">
          <TabsList className="bg-card">
            <TabsTrigger value="1d" className="text-card-foreground">
              1D
            </TabsTrigger>
            <TabsTrigger value="3d" className="text-card-foreground">
              3D
            </TabsTrigger>
            <TabsTrigger value="7d" className="text-card-foreground">
              7D
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary">Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            {error.price ? (
              <div className="text-red-600">{error.price}</div>
            ) : loading.price ? (
              <div className="text-muted-foreground">Loading chart data...</div>
            ) : (
              <ChartContainer
                config={{
                  price: { label: "Price", color: "hsl(var(--primary))" },
                  volume: { label: "Volume", color: "hsl(var(--muted))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                      stroke="var(--muted-foreground)"
                    />
                    <YAxis yAxisId="left" stroke="var(--muted-foreground)" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="var(--muted-foreground)"
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="volume"
                      stroke="hsl(var(--muted))"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary">Trades Feed</CardTitle>
          </CardHeader>
          <CardContent>
            {error.trades ? (
              <div className="text-red-600">{error.trades}</div>
            ) : loading.trades ? (
              <div className="text-muted-foreground">Loading trades...</div>
            ) : (
              <FeedCard
                trades={filteredTrades}
                onFilterClick={handleFilterClick}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
