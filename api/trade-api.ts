// api.ts
import { PriceData, Trades } from "@/types/dashboard";

const API_BASE_URL = "https://app.castmoney.xyz/api/test";

export const fetchPriceData = async (): Promise<PriceData[]> => {
  const response = await fetch(
    `${API_BASE_URL}/price?chainId=8453&address=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch price data");
  }
  return response.json();
};

export const fetchTradesData = async (): Promise<Trades[]> => {
  const response = await fetch(
    `${API_BASE_URL}/trades?chainId=8453&address=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch trades data");
  }
  return response.json();
};
