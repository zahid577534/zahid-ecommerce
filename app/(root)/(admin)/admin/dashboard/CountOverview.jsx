"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlineShoppingBag } from "react-icons/md";

import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_PRODUCT_SHOW,
  ADMIN_CUSTOMERS_SHOW,
} from "@/routes/AdminRoute";

const CountOverview = () => {
  const [counts, setCounts] = useState({
    categories: 0,
    products: 0,
    customers: 0,
    orders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/dashboard/admin/count", {
          method: "GET",
          credentials: "include", // ✅ send cookies
          cache: "no-store", // ✅ prevent caching issues (VERY IMPORTANT)
        });

        // 🔥 Handle unauthorized explicitly
        if (res.status === 403) {
          console.error("Unauthorized access - redirecting to login");
          window.location.href = "/auth/login";
          return;
        }

        const data = await res.json();

        if (data.success && data.data) {
          setCounts(data.data);
        } else {
          console.error("API error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cardData = [
    {
      title: "Total Categories",
      count: counts.categories,
      icon: <BiCategory size={20} />,
      link: ADMIN_CATEGORY_SHOW,
    },
    {
      title: "Total Products",
      count: counts.products,
      icon: <IoShirtOutline size={20} />,
      link: ADMIN_PRODUCT_SHOW,
    },
    {
      title: "Total Customers",
      count: counts.customers,
      icon: <IoMdStarOutline size={20} />,
      link: ADMIN_CUSTOMERS_SHOW,
    },
    {
      title: "Total Orders",
      count: counts.orders,
      icon: <MdOutlineShoppingBag size={20} />,
      link: "/admin/order",
    },
  ];

  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5 sm:gap-10 mt-10 w-full">
      {cardData.map((card, index) => (
        <Link key={index} href={card.link} className="group block w-full">
          <div
            className="flex items-center justify-between p-4 rounded-xl shadow-sm border h-full transition-all
            bg-card text-card-foreground border-border
            hover:border-green-500/50 hover:shadow-md"
          >
            {/* Left Content */}
            <div className="flex flex-col">
              <h4 className="text-sm text-muted-foreground font-medium">
                {card.title}
              </h4>

              <span className="text-2xl font-bold mt-1">
                {loading ? "..." : card.count ?? 0}
              </span>
            </div>

            {/* Icon */}
            <span
              className="w-12 h-12 flex items-center justify-center rounded-full transition-colors
              bg-secondary text-secondary-foreground
              group-hover:bg-green-600 group-hover:text-white ml-4"
            >
              {card.icon}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CountOverview;