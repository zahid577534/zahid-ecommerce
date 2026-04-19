'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const hasOrderId = Boolean(orderId);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 text-center">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
            ✓
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Order Confirmed
        </h1>

        {/* Message */}
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {/* Order ID */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">Order ID</p>
          {hasOrderId ? (
            <p className="mt-1 font-mono text-lg text-gray-900 break-all">
              {orderId}
            </p>
          ) : (
            <p className="mt-1 text-sm text-red-500">
              Unable to retrieve order ID.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full inline-block bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}