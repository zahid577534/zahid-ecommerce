'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LatestOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/get-orders");

      // show only latest 10 orders
      setOrders(res.data.orders.slice(0, 10));
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "delivered":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="h-[350px] overflow-y-auto border border-gray-200 rounded-lg">

      {/* horizontal scroll */}
      <div className="w-full overflow-x-auto">

        <Table className="min-w-[700px]">

          {/* HEADER */}
          <TableHeader className="sticky top-0 bg-white z-10 border-b">
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No orders found 🚫
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id} className="hover:bg-gray-50">

                  {/* CUSTOMER */}
                  <TableCell className="font-medium">
                    {order.customer?.name}
                  </TableCell>

                  {/* PHONE */}
                  <TableCell>
                    {order.customer?.phone}
                  </TableCell>

                  {/* ITEMS COUNT */}
                  <TableCell>
                    {order.products?.length || 0}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </TableCell>

                  {/* AMOUNT */}
                  <TableCell className="text-right font-semibold">
                    Rs {order.total?.toLocaleString()}
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </div>
    </div>
  );
};

export default LatestOrder;