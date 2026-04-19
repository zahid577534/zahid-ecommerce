"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react";

import { Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function OrderStatus() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/get-orders");
      const orders = res.data.orders;

      const grouped = groupByStatus(orders);
      setChartData(grouped);

    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Group orders by status
  const groupByStatus = (orders) => {
    const statusMap = {};

    orders.forEach((order) => {
      const status = order.status || "unknown";

      if (!statusMap[status]) {
        statusMap[status] = 0;
      }

      statusMap[status] += 1;
    });

    // color mapping
    const colors = {
      pending: "#4f46e5",
      processing: "#14b8a6",
      shipped: "#f97316",
      delivered: "#eab308",
      cancelled: "#a3a3a3",
      unverified: "#971a1a",
      confirmed: "#22c55e",
    };

    return Object.keys(statusMap).map((status) => ({
      status,
      count: statusMap[status],
      fill: colors[status] || "#8884d8",
    }));
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Order Status Overview</CardTitle>
        <CardDescription>Real-time order breakdown</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />

              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                outerRadius={100}
                label
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          Live order status tracking <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Based on real database orders
        </div>
      </CardFooter>
    </Card>
  );
}

export default OrderStatus;