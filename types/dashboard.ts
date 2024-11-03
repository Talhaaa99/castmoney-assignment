export interface PriceData {
  timestamp: number;
  price: number;
  volume: number;
}

export interface Trades {
  id: number;
  user: string;
  avatar: string;
  bio: string;
  amount: string;
  timestamp: string;
  type: "buy" | "sell";
}
