"use client";
import React, { useState, useMemo, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { PriceData, Trades } from "@/types/dashboard";

interface ModernChartProps {
  priceData: PriceData[];
  trades: Trades[];
  tokenSymbol: string;
}

type TimeSpan = "1d" | "3d" | "7d";

const ModernChart: React.FC<ModernChartProps> = ({
  priceData,
  trades,
  tokenSymbol,
}) => {
  const [selectedTimespan, setSelectedTimespan] = useState<TimeSpan>("1d");
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imagesLoading, setImagesLoading] = useState(true);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getComparableTime = (timestamp: number) => {
    return Math.floor(timestamp / (5 * 60)) * (5 * 60);
  };

  const filteredPriceData = useMemo(() => {
    if (priceData.length === 0) return [];

    const sortedData = [...priceData].sort((a, b) => a.timestamp - b.timestamp);
    const mostRecentTimestamp = sortedData[sortedData.length - 1].timestamp;
    const timespanInDays = parseInt(selectedTimespan);
    const cutoffTime = mostRecentTimestamp - timespanInDays * 24 * 60 * 60;

    return sortedData.filter((data) => data.timestamp >= cutoffTime);
  }, [priceData, selectedTimespan]);

  const formattedPriceData = useMemo(() => {
    return filteredPriceData.map((data) => ({
      date: formatDate(data.timestamp),
      price: parseFloat(data.price),
      timestamp: getComparableTime(data.timestamp),
    }));
  }, [filteredPriceData]);

  const dates = formattedPriceData.map((data) => data.date);
  const prices = formattedPriceData.map((data) => data.price);

  const filteredTrades = useMemo(() => {
    if (trades.length === 0 || filteredPriceData.length === 0) return [];

    const mostRecentTimestamp =
      filteredPriceData[filteredPriceData.length - 1].timestamp;
    const timespanInDays = parseInt(selectedTimespan);
    const cutoffTime = mostRecentTimestamp - timespanInDays * 24 * 60 * 60;

    return trades.filter((trade) => parseInt(trade.timestamp) >= cutoffTime);
  }, [trades, filteredPriceData, selectedTimespan]);

  useEffect(() => {
    const imagePromises = filteredTrades.map((trade) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(
            (prev) => new Set([...prev, trade.profile.profile_picture])
          );
          resolve();
        };
        img.src = trade.profile.profile_picture;
      });
    });

    Promise.all(imagePromises).then(() => setImagesLoading(false));
  }, [filteredTrades]);

  const getChartOptions = () => {
    const markPoints = filteredTrades
      .map((trade) => {
        const tradeTimestamp = getComparableTime(parseInt(trade.timestamp));

        // Function to find the closest price data point
        const findClosestPrice = (timestamp: number) => {
          return formattedPriceData.reduce((prev, curr) => {
            return Math.abs(curr.timestamp - timestamp) <
              Math.abs(prev.timestamp - timestamp)
              ? curr
              : prev;
          });
        };

        const closestPrice = findClosestPrice(tradeTimestamp);

        if (!closestPrice) {
          console.error(
            "No closest price found for trade at timestamp",
            tradeTimestamp
          );
          return null; // Skip if no closest price
        }

        return {
          symbolSize: 32,
          symbol: `image://${trade.profile.profile_picture}`,
          itemStyle: {
            borderColor:
              trade.transaction_type === "buy" ? "#00FF41" : "#ff4141",
            borderWidth: 2,
            borderType: "solid",
            shadowBlur: 10,
            shadowColor:
              trade.transaction_type === "buy" ? "#00FF41" : "#ff4141",
          },
          coord: [
            closestPrice.date, // Use the closest date
            closestPrice.price,
          ],
          value: trade.amount_usd,
          trade: trade, // Store trade data for tooltip
        };
      })
      .filter((point) => point !== null); // Filter out nulls

    console.log("Final Mark Points Count:", markPoints.length); // Check count of mark points

    return {
      backgroundColor: "#000",
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line",
          lineStyle: {
            color: "#00FF41",
            type: "dashed",
          },
        },
        textStyle: { color: "#00FF41" },
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        borderColor: "#00FF41",
        formatter: (params: any) => {
          const markPoint = params[0]?.data?.markPoint;
          if (markPoint) {
            const trade = markPoint.trade;
            return `
              <div style="padding: 8px">
                <div>${tokenSymbol} Price: $${params[0].data[1].toFixed(
              2
            )}</div>
                <div style="color: ${
                  trade.transaction_type === "buy" ? "#00FF41" : "#ff4141"
                }">
                  ${trade.transaction_type.toUpperCase()} by ${
              trade.profile.username
            }
                </div>
                <div>Amount: $${Number(trade.amount_usd).toLocaleString()}</div>
                <div>Time: ${formatDate(parseInt(trade.timestamp))}</div>
              </div>
            `;
          }
          return `${tokenSymbol} Price: $${params[0].data[1].toFixed(2)}`;
        },
      },
      grid: {
        top: 50,
        right: 20,
        bottom: 30,
        left: 60,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLine: {
          lineStyle: { color: "#333" },
        },
        axisTick: { show: false },
        axisLabel: {
          color: "#00FF41",
          interval: Math.floor(dates.length / 6),
          fontSize: 11,
          formatter: (value: string) => value.split(",")[0],
        },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: "#00FF41",
          formatter: (value: number) => `$${value.toLocaleString()}`,
        },
        splitLine: { show: false },
      },
      series: [
        {
          name: `${tokenSymbol} Price`,
          type: "line",
          data: prices.map((price, index) => [dates[index], price]),
          smooth: true,
          symbol: "none",
          lineStyle: { color: "#00FF41", width: 2 },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(0, 255, 65, 0.2)",
                },
                {
                  offset: 1,
                  color: "rgba(0, 255, 65, 0)",
                },
              ],
            },
          },
          markPoint: {
            symbol: "circle",
            symbolSize: 32,
            data: markPoints,
            label: {
              show: false,
            },
          },
        },
      ],
    };
  };

  // Conditional rendering based on image loading
  if (imagesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end gap-2">
        {(["1d", "3d", "7d"] as TimeSpan[]).map((span) => (
          <Button
            key={span}
            variant={selectedTimespan === span ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTimespan(span)}
            className="flex items-center gap-1"
          >
            <Clock className="w-4 h-4" />
            {span}
          </Button>
        ))}
      </div>

      <ReactECharts
        option={getChartOptions()}
        style={{ height: "400px", width: "100%" }}
      />
    </div>
  );
};

export default ModernChart;
