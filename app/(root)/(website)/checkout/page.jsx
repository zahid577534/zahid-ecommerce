'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import axios from 'axios';
import { clearCart } from '@/redux/cartSlice';

const CheckOut = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartStore);

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [placingOrder, setPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  });

  const totalPrice = cart?.products?.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  );

  const shipping = 0;
  const finalTotal = totalPrice + shipping;

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ PLACE ORDER FUNCTION (FIXED)
  const placeOrder = async () => {
    if (!cart.products.length) return alert('Cart is empty');

    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      return alert('Please fill all required fields');
    }

    setPlacingOrder(true);

    try {
      // ✅ CREATE ORDER
      const res = await axios.post('/api/create-order', {
        customer: formData,
        products: cart.products,
        total: finalTotal,
        paymentMethod, // ⭐ IMPORTANT
      });

      const { orderId } = res.data;

      // ✅ CASH ON DELIVERY FLOW
      if (paymentMethod === "cod") {
        dispatch(clearCart());
        window.location.href = `/order-success?orderId=${orderId}`;
        return;
      }

      // ✅ ONLINE PAYMENT FLOW
      const payment = await axios.post('/api/payment', {
        orderId,
        amount: finalTotal,
      });

      window.location.href = payment.data.url;

    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen px-4 lg:px-20 py-10 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8">Checkout</h2>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* FORM */}
        <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-3">Billing Details</h3>

          <input name="name" placeholder="Full Name*" required onChange={handleChange} className="border p-3 w-full rounded-md" />
          <input name="phone" placeholder="Phone*" required onChange={handleChange} className="border p-3 w-full rounded-md" />
          <input name="email" placeholder="Email" onChange={handleChange} className="border p-3 w-full rounded-md" />
          <input name="city" placeholder="City*" required onChange={handleChange} className="border p-3 w-full rounded-md" />
          <input name="address" placeholder="Address*" required onChange={handleChange} className="border p-3 w-full rounded-md" />

          <textarea name="notes" placeholder="Order Notes (optional)" onChange={handleChange} className="border p-3 w-full rounded-md" />
        </div>

        {/* SUMMARY */}
        <div className="lg:w-1/3 sticky top-10 h-fit bg-white border p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg mb-5 border-b pb-3">Order Summary</h3>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {cart.products.map((item) => (
              <div key={item.variantId} className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Image
                    src={item.media || '/placeholder.png'}
                    width={50}
                    height={50}
                    alt=""
                    className="rounded-md border"
                  />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-medium">
                  Rs {(item.sellingPrice * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* PRICE */}
          <div className="mt-6 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>Rs {totalPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-5 pt-4 border-t">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-xl font-bold">
              Rs {finalTotal.toLocaleString()}
            </span>
          </div>

          {/* ✅ PAYMENT METHOD */}
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Payment Method</h3>

            <label className="flex gap-2 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Online Payment
            </label>

            <label className="flex gap-2 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
          </div>

          {/* BUTTON */}
          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className="w-full mt-6 bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
          >
            {placingOrder ? 'Processing...' : 'Place Order'}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Secure payment • Fast delivery
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;