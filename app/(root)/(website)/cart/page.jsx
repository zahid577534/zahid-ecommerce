'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';

import WebSiteBreadcrumb from '@/components/Application/Website/WebSiteBreadcrumb';
import { PRODUCT_DETAIL, WEBSITE_SHOP, WEBSITE_CHECKOUT } from '@/routes/WebsiteRoute';
import imagePlaceholder from '@/public/assets/images/img-placeholder.webp';

import { Button } from '@/components/ui/button';
import { HiOutlineTrash } from 'react-icons/hi';
import { removeFromCart } from '@/redux/cartSlice';

const breadCrumb = {
    title: 'Cart',
    links: [{ label: 'Cart' }],
};

const ViewCart = () => {
    const dispatch = useDispatch();
    const cart = useSelector((store) => store.cartStore);

    const totalPrice = cart?.products?.reduce(
        (acc, item) => acc + item.sellingPrice * item.quantity,
        0
    );

    return (
        <div>
            <WebSiteBreadcrumb props={breadCrumb} />

            {/* Empty Cart */}
            {cart?.count === 0 ? (
                <div className="w-full min-h-[60vh] flex justify-center items-center py-20 px-4">
                    <div className="text-center space-y-4">
                        <h4 className="text-2xl sm:text-4xl font-semibold">
                            Your Cart is empty!
                        </h4>

                        <Button asChild>
                            <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 my-10 lg:px-24 px-4">

                    {/* LEFT: CART ITEMS */}
                    <div className="lg:w-[70%] w-full">

                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto border rounded-lg">
                            <table className="w-full">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th className="text-left p-4">Product</th>
                                        <th className="text-center p-4">Price</th>
                                        <th className="text-center p-4">Qty</th>
                                        <th className="text-center p-4">Total</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cart.products.map((product) => (
                                        <tr key={product.variantId} className="border-b">

                                            {/* Product */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <Image
                                                        src={product.media || imagePlaceholder}
                                                        width={70}
                                                        height={70}
                                                        alt={product.name}
                                                        className="rounded-md"
                                                    />

                                                    <div className="space-y-1">
                                                        <Link
                                                            href={PRODUCT_DETAIL(product.url)}
                                                            className="font-medium hover:text-primary"
                                                        >
                                                            {product.name}
                                                        </Link>

                                                        {/* Color */}
                                                        {product.color && (
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <span>{product.color?.name}</span>
                                                                <span
                                                                    className="w-3 h-3 rounded-full border"
                                                                    style={{ backgroundColor: product.color?.hex }}
                                                                />
                                                            </div>
                                                        )}

                                                        {/* Size */}
                                                        {product.size && (
                                                            <p className="text-xs text-gray-500">
                                                                Size: {product.size}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="text-center">Rs {product.sellingPrice}</td>
                                            <td className="text-center">{product.quantity}</td>
                                            <td className="text-center font-medium">
                                                Rs {product.sellingPrice * product.quantity}
                                            </td>

                                            {/* Remove */}
                                            <td className="text-center">
                                                <button
                                                    onClick={() =>
                                                        dispatch(removeFromCart(product.variantId))
                                                    }
                                                    className="text-red-500 hover:scale-110 transition"
                                                >
                                                    <HiOutlineTrash size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {cart.products.map((product) => (
                                <div
                                    key={product.variantId}
                                    className="border rounded-lg p-4 shadow-sm space-y-3"
                                >
                                    <div className="flex gap-4">
                                        <Image
                                            src={product.media || imagePlaceholder}
                                            width={80}
                                            height={80}
                                            alt={product.name}
                                            className="rounded-md"
                                        />

                                        <div className="flex-1 space-y-1">
                                            <Link
                                                href={PRODUCT_DETAIL(product.url)}
                                                className="font-medium text-sm"
                                            >
                                                {product.name}
                                            </Link>

                                            {/* Color */}
                                            {product.color && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>{product.color?.name}</span>
                                                    <span
                                                        className="w-3 h-3 rounded-full border"
                                                        style={{ backgroundColor: product.color?.hex }}
                                                    />
                                                </div>
                                            )}

                                            {/* Size */}
                                            {product.size && (
                                                <p className="text-xs text-gray-500">
                                                    Size: {product.size}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price Row */}
                                    <div className="flex justify-between text-sm">
                                        <span>Price</span>
                                        <span>Rs {product.sellingPrice}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span>Quantity</span>
                                        <span>{product.quantity}</span>
                                    </div>

                                    <div className="flex justify-between font-medium">
                                        <span>Total</span>
                                        <span>Rs {product.sellingPrice * product.quantity}</span>
                                    </div>

                                    <button
                                        onClick={() =>
                                            dispatch(removeFromCart(product.variantId))
                                        }
                                        className="text-red-500 text-sm flex items-center gap-1"
                                    >
                                        <HiOutlineTrash size={16} />
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: SUMMARY */}
                    <div className="lg:w-[30%] w-full">
                        <div className="border rounded-lg p-5 shadow-sm space-y-4 lg:sticky lg:top-20">

                            <h3 className="text-lg font-semibold">Cart Summary</h3>

                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>Rs {totalPrice}</span>
                            </div>

                            <div className="flex justify-between font-semibold border-t pt-3">
                                <span>Total</span>
                                <span>Rs {totalPrice}</span>
                            </div>

                            <Button asChild className="w-full">
                                <Link href={WEBSITE_CHECKOUT}>Checkout</Link>
                            </Button>

                            <Button variant="outline" asChild className="w-full">
                                <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewCart;