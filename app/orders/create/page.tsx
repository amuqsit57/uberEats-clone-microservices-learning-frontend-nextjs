import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";

export default function CreateOrderPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Orders
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Create order
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              A simple order form you can connect to your backend later.
            </p>
          </div>

          <LogoutButton />
        </div>

        <form className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="customer" className="text-sm font-medium text-slate-700">
                Customer name
              </label>
              <input
                id="customer"
                type="text"
                placeholder="Acme Inc."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
              >
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="product" className="text-sm font-medium text-slate-700">
                Product
              </label>
              <input
                id="product"
                type="text"
                placeholder="Laptop"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-slate-700">
                Total amount
              </label>
              <input
                id="amount"
                type="number"
                placeholder="240"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              placeholder="Add order notes..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Save order
            </button>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Back to orders
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
