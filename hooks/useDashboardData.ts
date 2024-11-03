import { useEffect, useState } from "react";
import { fetchPriceData, fetchTradesData } from "@/api/trade-api";
import { PriceData, Trades } from "@/types/dashboard";

export const useDashboardData = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [trades, setTrades] = useState<Trades[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [priceResponse, tradesResponse] = await Promise.all([
          fetchPriceData(),
          fetchTradesData(),
        ]);

        setPriceData(priceResponse);
        setTrades(tradesResponse);
      } catch {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { priceData, trades, loading, error };
};
