export interface PriceData {
  id: number;
  token_address: string;
  chain_id: number;
  timestamp: number;
  price: string; // Consider using number if you want to handle it as a numeric value
  created_at: string; // You may also consider using Date type if you want to handle it as a date
  updated_at: string; // Same as above
}

export interface Profile {
  fid: number;
  username: string;
  display_name: string;
  profile_picture: string;
  bio: string;
}

export interface Trades {
  fid: number;
  profile: Profile;
  transaction_type: "buy" | "sell";
  timestamp: string;
  trade_token: string;
  transaction_hash: string;
  amount_usd: string;
}
