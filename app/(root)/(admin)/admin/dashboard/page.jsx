import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import CountOverview from "./CountOverview";
import QuickAdd from "./QuickAdd";
import OrderOverView from "./OrderOverView";
import OrderStatus from "./OrderStatus";
import LatestOrder from "./LatestOrder";
import LatestReview from "./LatestReview";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col gap-6 min-h-screen p-4">

      {/* TOP STATS */}
      <CountOverview />
      <QuickAdd />

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* REVENUE CHART */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <span className="font-semibold">Revenue Overview</span>

            <Link href="/admin/orders">
              <Button size="sm">View Orders</Button>
            </Link>
          </CardHeader>

          <CardContent>
            <OrderOverView />
          </CardContent>
        </Card>

        {/* ORDER STATUS CHART */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <span className="font-semibold">Order Status</span>

            <Link href="/admin/orders">
              <Button size="sm">Manage Orders</Button>
            </Link>
          </CardHeader>

          <CardContent>
            <OrderStatus />
          </CardContent>
        </Card>

      </div>

      {/* TABLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* LATEST ORDERS */}
        <Card className="flex flex-col">
          <CardHeader className="flex justify-between items-center">
            <span className="font-semibold">Latest Orders</span>

            <Link href="/admin/orders">
              <Button size="sm">View All</Button>
            </Link>
          </CardHeader>

          <CardContent className="overflow-y-auto max-h-[350px]">
            <LatestOrder />
          </CardContent>
        </Card>

        {/* REVIEWS */}
        <Card className="flex flex-col">
          <CardHeader className="flex justify-between items-center">
            <span className="font-semibold">Latest Reviews</span>

            <Link href="/admin/reviews">
              <Button size="sm">View All</Button>
            </Link>
          </CardHeader>

          <CardContent className="overflow-y-auto max-h-[350px]">
            <LatestReview />
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminDashboard;