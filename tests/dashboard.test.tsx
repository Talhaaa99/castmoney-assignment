import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "@/components/trading-dashboard";
import { useDashboardData } from "@/hooks/useDashboardData";

jest.mock("@/hooks/useDashboardData");

describe("Dashboard", () => {
  it("displays loading state initially", () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      priceData: [],
      trades: [],
      loading: true,
      error: null,
    });
    render(<Dashboard />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading data...");
  });

  it("displays error message on failure", async () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      priceData: [],
      trades: [],
      loading: false,
      error: "Failed to fetch data. Please try again later.",
    });
    render(<Dashboard />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to fetch data."
    );
  });

  it("displays data when loaded", async () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      priceData: [{ timestamp: "2024-01-01", price: 0.02446, volume: 1000000 }],
      trades: [
        {
          id: 1,
          user: "eth_eth",
          avatar: "/placeholder.svg",
          bio: "Trader",
          amount: "$2.3K",
          timestamp: "2024-01-01",
          type: "buy",
        },
      ],
      loading: false,
      error: null,
    });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText("$TOKEN")).toBeInTheDocument());
  });
});
