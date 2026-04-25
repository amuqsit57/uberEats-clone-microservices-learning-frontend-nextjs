"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Delete, Edit, PlusCircle, RefreshCw } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrdersApiError, Order, getMyOrders } from "@/lib/orders";

import ServerComponent from "./server_component";
function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function OrdersPageClient() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken ?? null;

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  const emptyStateLabel = useMemo(() => {
    if (status === "loading") {
      return "Loading your orders...";
    }

    if (!accessToken) {
      return "No active session found.";
    }

    return "No orders yet.";
  }, [accessToken, status]);


  function handleApproveOrderId(orderId: number) {
    const res = fetch(`http://localhost:5001/api/orders/${orderId}`,{
      method: "PUT",
      body: JSON.stringify({
        status: "CONFIRMED",
        userId: session?.user?.id,
      }),
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })
  }
  
    
  
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!accessToken) {
      setIsLoading(false);
      setOrders([]);
      setError("You need to sign in to see your orders.");
      return;
    }

    let isActive = true;

    async function loadOrders() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getMyOrders(accessToken);
        if (!isActive) {
          return;
        }

        setOrders(response.orders);
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        const message =
          requestError instanceof OrdersApiError
            ? requestError.message
            : "Unable to load orders.";
        setError(message);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isActive = false;
    };
  }, [accessToken, status, refreshIndex]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.12),transparent_24%),linear-gradient(180deg,#fff,#f8fafc)] px-6 py-12">
    
    <ServerComponent
    />
    
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Orders
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Your orders in one place
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              This page reads from the Orders Service through a shared data layer, so the UI stays thin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRefreshIndex((current) => current + 1)}
              disabled={isLoading || status === "loading"}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
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

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Order
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Customer
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Total
                </TableHead>
                <TableHead className="">
                    Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                    Loading orders from the backend...
                  </TableCell>
                </TableRow>
              ) : orders.length ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-6 py-4 font-medium text-slate-950">
                      #{order.id}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-slate-700">
                      <div className="space-y-1">
                        <div className="font-medium text-slate-950">
                          {order.userName ?? "Unknown customer"}
                        </div>
                        <div className="text-xs text-slate-500">{order.userEmail ?? "No email available"}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right font-medium text-slate-950">
                      {formatCurrency(order.totalPrice)}
                    </TableCell>

                     <TableCell className="px-6 py-4 text-right font-medium text-slate-950">
                      <div className="flex items-center justify-end gap-4">
                        <Edit
                          className="h-4 w-4 cursor-pointer text-slate-500 transition hover:text-slate-700"
                          onClick={() => {
                            // For simplicity, we just alert the order ID here. In a real app, you would navigate to an order details page or open a modal.
                            handleApproveOrderId(order.id);
                          }}
                        />

                        <Delete
                          className="h-4 w-4 cursor-pointer text-slate-500 transition hover:text-slate-700"
                          onClick={() => {
                            // For simplicity, we just alert the order ID here. In a real app, you would navigate to an order details page or open a modal.
                            alert(`Delete order #${order.id}`);
                          }}
                        />

                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                    {emptyStateLabel}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}