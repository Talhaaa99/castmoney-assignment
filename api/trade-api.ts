"use client";
import axios from "axios"; // Import axios
import { PriceData, Trades } from "@/types/dashboard";

const API_BASE_URL = "https://app.castmoney.xyz/api/test";

export const fetchPriceData = async (): Promise<PriceData[]> => {
  try {
    const response = await axios.get<PriceData[]>(
      `${API_BASE_URL}/price?chainId=8453&address=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed`
    );
    return response.data; // Return the data directly from the response
  } catch (error) {
    console.error("Error fetching price data:", error); // Log the error for debugging
    throw new Error("Failed to fetch price data");
  }
};

export const fetchTradesData = async (): Promise<Trades[]> => {
  try {
    const response = await axios.get<Trades[]>(
      `${API_BASE_URL}/trades?chainId=8453&address=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed`
    );
    return response.data; // Return the data directly from the response
  } catch (error) {
    console.error("Error fetching trades data:", error); // Log the error for debugging
    throw new Error("Failed to fetch trades data");
  }
};
