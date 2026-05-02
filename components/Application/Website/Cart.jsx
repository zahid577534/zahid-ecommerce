'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { BsCart2 } from 'react-icons/bs';
import { HiOutlineTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";

import { removeFromCart } from '@/redux/cartSlice';
import { WEBSITE_CHECKOUT, WEBSITE_CART } from '@/routes/WebsiteRoute';
import { showToast } from '@/lib/showToast';

const Cart = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const cart = useSelector((state) => state.cartStore) || {
    products: [],
    count: 0,
  };

  const totalPrice = cart.products.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Cart Icon */}
      <SheetTrigger className="relative">
        <BsCart2 size={25} className="text-gray-600 hover:text-primary transition" />

        {cart.count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {cart.count}
          </span>
        )}
      </SheetTrigger>

      {/* Cart Drawer */}
      <SheetContent className="flex flex-col w-full sm:max-w-md p-4">
        <SheetHeader className="mb-2">
          <SheetTitle className="text-lg font-semibold">Your Cart</SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Review your items before checkout
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {cart.products.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Your cart is empty
            </div>
          ) : (
            cart.products.map((item) => (
              <div
                key={item.variantId}
                className="flex justify-between items-center border rounded-lg p-3 shadow-sm"
              >
                <div className="flex gap-3 items-center">
                  <Image
                    src={item.media || "/placeholder.png"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />

                  <div className="space-y-1">
                    <p className="font-medium text-sm sm:text-base">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      $ {item.sellingPrice}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    dispatch(removeFromCart(item.variantId))
                  }
                  className="text-red-500 hover:scale-110 transition"
                >
                  <HiOutlineTrash size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.products.length > 0 && (
          <div className="border-t mt-4 pt-4 space-y-3 sticky bottom-0 bg-white">
            
            {/* Total */}
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>$ {totalPrice}</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              
              {/* View Cart */}
              <Button variant="outline" asChild className="w-full">
                <Link href={WEBSITE_CART} onClick={() => setOpen(false)}>
                  View Cart
                </Link>
              </Button>

              {/* Checkout */}
              <Button
                asChild
                className="w-full"
                onClick={() => setOpen(false)}
              >
                {cart.count ? (
                  <Link href={WEBSITE_CHECKOUT}>Checkout</Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      showToast('error', 'Your cart is empty')
                    }
                  >
                    Checkout
                  </button>
                )}
              </Button>
            </div>

            {/* Close */}
            <SheetClose asChild>
              <button className="w-full border py-2 rounded-md text-sm hover:bg-gray-100 transition">
                Close
              </button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;