import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";
import { PriceData, Trades } from "@/types/dashboard";
import Image from "next/image";

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  LinearScale,
  Title,
  CategoryScale
);

interface ModernChartProps {
  priceData: PriceData[];
  trades: Trades[];
  tokenSymbol: string;
}

const ModernChart: React.FC<ModernChartProps> = ({
  priceData,
  trades,
  tokenSymbol,
}) => {
  const chartData = {
    labels: priceData.map((data) =>
      new Date(data.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: `${tokenSymbol} Price`,
        data: priceData.map((data) => parseFloat(data.price)),
        borderColor: "blue",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
      },
    ],
  };

  const tradeAnnotations = trades.map((trade) => ({
    x: new Date(trade.timestamp).toLocaleDateString(),
    y: parseFloat(
      priceData.find((p) => p.timestamp === +new Date(trade.timestamp))
        ?.price || "0"
    ),
    icon: trade.transaction_type === "buy" ? "green" : "red",
    profilePicture: trade.profile.profile_picture,
    transaction_type: trade.transaction_type,
  }));

  return (
    <div>
      <Line
        data={chartData}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const trade = tradeAnnotations.find(
                    (t) => t.x === context.label
                  );
                  return trade
                    ? `${
                        trade.transaction_type === "buy" ? "Buy" : "Sell"
                      } by ${trade.profilePicture} @ $${context.parsed.y}`
                    : `$${context.parsed.y}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        }}
      />
      <div className="trade-icons">
        {tradeAnnotations.map((trade, index) => (
          <Image
            key={index}
            src={trade.profilePicture}
            alt={trade.icon}
            className={`w-6 h-6 rounded-full border-2 ${
              trade.icon === "green" ? "border-green-500" : "border-red-500"
            }`}
            width={24}
            height={24}
            style={{
              position: "absolute",
              left: `${index * 15}px`,
              top: "0px",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ModernChart;
