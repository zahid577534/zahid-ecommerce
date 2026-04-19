'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("/api/get-orders");
    setOrders(res.data.orders);
  };

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
    await axios.put("/api/update-order", {
      orderId: id,
      status,
    });

    fetchOrders();
  };

  // ✅ DELETE ORDER
  const deleteOrder = async (id) => {
    const confirmDelete = confirm("Delete this order?");
    if (!confirmDelete) return;

    await axios.delete("/api/delete-order", {
      data: { orderId: id },
    });

    fetchOrders();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Dashboard</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">City</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Products</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center border-t">
                <td className="p-2">{order.customer?.name}</td>
                <td className="p-2">{order.customer?.phone}</td>
                <td className="p-2">{order.customer?.city}</td>
                <td className="p-2">Rs {order.total}</td>
                <td className="p-2 capitalize">{order.paymentMethod}</td>

                {/* STATUS */}
                <td className="p-2">
                  <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                    {order.status}
                  </span>
                </td>

                {/* PRODUCTS */}
                <td className="p-2 text-left">
                  {order.products.map((p, i) => (
                    <div key={i}>
                      {p.name} × {p.quantity}
                    </div>
                  ))}
                </td>

                {/* ACTIONS */}
                <td className="p-2 space-y-1">
                  <button
                    onClick={() => updateStatus(order._id, "confirmed")}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "cancelled")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "delivered")}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Delivered
                  </button>

                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!orders.length && (
          <p className="text-center py-6">No orders found 🚫</p>
        )}
      </div>
    </div>
  );
}