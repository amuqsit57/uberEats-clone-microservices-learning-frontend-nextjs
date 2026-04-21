import Link from "next/link";
import { ArrowRight, ClipboardList, PlusCircle } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_22%),linear-gradient(180deg,#fff,#f8fafc)] px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl flex-col justify-center gap-10">
        <div className="flex justify-end">
          <LogoutButton />
        </div>

        <section className="max-w-2xl space-y-5">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
            Orders dashboard
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Manage orders from one simple place.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              Create a new order, review existing orders, and keep the workflow
              in one clean screen.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/orders/create"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <PlusCircle className="h-4 w-4" />
              Create order
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ClipboardList className="h-4 w-4" />
              See orders
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href="/orders/create"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <PlusCircle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-950">Create order</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
              Open a lightweight form to enter order details and submit a new
              request.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-950">
              Go to form <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/orders"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <ClipboardList className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-950">See orders</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
              View a clean list of all orders with status, customer, and total.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-950">
              Browse orders <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
