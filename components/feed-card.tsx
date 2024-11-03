import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";

interface Trade {
  id: number;
  user: string;
  avatar: string;
  bio: string;
  amount: string;
  timestamp: string;
  type: "buy" | "sell";
}

interface FeedCardProps {
  trades: Trade[];
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
              key={trade.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-black bg-opacity-40"
            >
              <Avatar>
                <AvatarImage src={trade.avatar} alt={trade.user} />
                <AvatarFallback>{trade.user[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium lowercase">{trade.user}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-zinc-300"
                    onClick={() => onFilterClick(trade.user)}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">filter by user</span>
                  </Button>
                </div>
                <p className="text-sm text-zinc-500 lowercase">{trade.bio}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={
                      trade.type === "buy" ? "text-green-400" : "text-red-400"
                    }
                  >
                    {trade.type.toLowerCase()}
                  </span>
                  <span>{trade.amount.toLowerCase()}</span>
                  <span className="text-zinc-500">
                    {trade.timestamp.toLowerCase()}
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
