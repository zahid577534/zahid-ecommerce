"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function OrderOverView() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/get-orders");
      const orders = res.data.orders;

      // ✅ Group orders by month
      const monthlyData = groupByMonth(orders);
      setChartData(monthlyData);

    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Convert orders → monthly revenue
  const groupByMonth = (orders) => {
    const months = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString("default", { month: "short" });

      if (!months[month]) {
        months[month] = 0;
      }

      months[month] += order.total || 0;
    });

    return Object.keys(months).map((month) => ({
      month,
      amount: months[month],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly sales from orders</CardDescription>
      </CardHeader>

      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="amount"
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Revenue growing with orders <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total revenue per month
        </div>
      </CardFooter>
    </Card>
  );
}

export default OrderOverView;