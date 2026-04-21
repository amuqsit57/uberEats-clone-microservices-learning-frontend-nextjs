import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";

const orders = [
  { id: "ORD-1001", customer: "Acme Inc.", status: "Processing", total: "$240.00" },
  { id: "ORD-1002", customer: "Nova Retail", status: "Shipped", total: "$129.50" },
  { id: "ORD-1003", customer: "Blue Peak", status: "Delivered", total: "$560.00" },
];

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Orders
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              See all orders
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              A simple list of recent orders with status and totals.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 sm:flex-row">
            <Link
              href="/orders/create"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <PlusCircle className="h-4 w-4" />
              Create order
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-4 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Status</span>
            <span className="text-right">Total</span>
          </div>

          <div className="divide-y divide-slate-200">
            {orders.map((order) => (
              <div key={order.id} className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
                <span className="font-medium text-slate-950">{order.id}</span>
                <span className="text-slate-700">{order.customer}</span>
                <span>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {order.status}
                  </span>
                </span>
                <span className="text-right font-medium text-slate-950">{order.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
