"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";

interface FeedCardProps {
  trades: {
    fid: number;
    profile: {
      fid: number;
      username: string;
      display_name: string;
      profile_picture: string;
      bio: string;
    };
    transaction_type: string;
    timestamp: string;
    trade_token: string;
    transaction_hash: string;
    amount_usd: string;
  }[];
  onFilterClick: (user: string) => void;
}

export function FeedCard({ trades, onFilterClick }: FeedCardProps) {
  return (
    <Card className="rounded-xl shadow-lg bg-zinc-900 text-zinc-300 border border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg lowercase">recent trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trades.map((trade) => (
            <div
              key={trade.transaction_hash}
              className="flex items-start gap-4 p-4 rounded-lg bg-black bg-opacity-40"
            >
              <Avatar>
                <AvatarImage
                  src={trade.profile.profile_picture}
                  alt={trade.profile.username}
                />
                <AvatarFallback>
                  {trade.profile.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium lowercase">
                    {trade.profile.display_name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-zinc-300"
                    onClick={() => onFilterClick(trade.profile.username)}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">filter by user</span>
                  </Button>
                </div>
                <p className="text-sm text-zinc-500 lowercase">
                  {trade.profile.bio}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={
                      trade.transaction_type === "buy"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {trade.transaction_type.toLowerCase()}
                  </span>
                  <span>${parseFloat(trade.amount_usd).toLocaleString()}</span>
                  <span className="text-zinc-500">
                    {new Date(
                      parseInt(trade.timestamp) * 1000
                    ).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
