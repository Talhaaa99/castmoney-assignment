import { useEffect, useState } from "react";
import { fetchPriceData, fetchTradesData } from "@/api/trade-api";
import { PriceData, Trades } from "@/types/dashboard";

export const useDashboardData = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [trades, setTrades] = useState<Trades[]>([]);
  const [loading, setLoading] = useState<{ price: boolean; trades: boolean }>({
    price: true,
    trades: true,
  });
  const [error, setError] = useState<{
    price: string | null;
    trades: string | null;
  }>({
    price: null,
    trades: null,
  });

  useEffect(() => {
    const loadPriceData = async () => {
      setLoading((prev) => ({ ...prev, price: true }));
      setError((prev) => ({ ...prev, price: null }));
      try {
        const data: PriceData[] = await fetchPriceData();
        setPriceData(data);
      } catch {
        setError((prev) => ({ ...prev, price: "Failed to load price data." }));
      } finally {
        setLoading((prev) => ({ ...prev, price: false }));
      }
    };

    const loadTradesData = async () => {
      setLoading((prev) => ({ ...prev, trades: true }));
      setError((prev) => ({ ...prev, trades: null }));
      try {
        const data: Trades[] = await fetchTradesData();
        setTrades(data);
      } catch {
        setError((prev) => ({ ...prev, trades: "Failed to load trade data." }));
      } finally {
        setLoading((prev) => ({ ...prev, trades: false }));
      }
    };

    loadPriceData();
    loadTradesData();
  }, []);

  return { priceData, trades, loading, error };
};
