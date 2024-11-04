"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedCard } from "./feed-card";
import { useDashboardData } from "@/hooks/useDashboardData";
import ModernChart from "./line-chart";

export default function Dashboard() {
  const [filteredUser, setFilteredUser] = useState<string | null>(null);
  const { priceData, trades, loading, error } = useDashboardData();

  const handleFilterClick = (user: string) => {
    setFilteredUser((prevUser) => (prevUser === user ? null : user));
  };

  const filteredTrades = filteredUser
    ? trades.filter((trade) => trade.profile.username === filteredUser)
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
          <CardContent>
            <ModernChart
              priceData={priceData}
              trades={filteredTrades}
              tokenSymbol="$TOKEN"
            />
          </CardContent>
        </Card>
        {/* Feed Card */}
        <Card className="p-0 shadow-lg">
          <CardContent>
            {error && error.trades ? (
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
