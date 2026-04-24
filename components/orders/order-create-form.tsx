"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OrdersApiError, createOrder } from "@/lib/orders";

type SessionWithAccessToken = {
  accessToken?: string;
};

type DraftItem = {
  id: string;
  name: string;
  quantity: string;
  price: string;
};

const emptyDraftItem = (): DraftItem => ({
  id: "1",
  name: "Burger",
  quantity: "1",
  price: "12.99",
});

export function OrderCreateForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const accessToken = (session as SessionWithAccessToken | null)?.accessToken ?? null;

  const [restaurantId, setRestaurantId] = useState("1");
  const [deliveryAddress, setDeliveryAddress] = useState("123 Main St");
  const [items, setItems] = useState<DraftItem[]>([emptyDraftItem()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function updateItem(index: number, field: keyof DraftItem, value: string) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        id: String(current.length + 1),
        name: "",
        quantity: "1",
        price: "0",
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!accessToken) {
      setErrorMessage("You need to sign in before creating an order.");
      return;
    }

    const parsedItems = items.map((item) => ({
      id: Number(item.id),
      name: item.name.trim(),
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    const totalPrice = parsedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    setIsSubmitting(true);

    try {
      const response = await createOrder(
        {
          items: parsedItems,
          restaurantId: Number(restaurantId),
          deliveryAddress: deliveryAddress.trim(),
          totalPrice,
        },
        accessToken,
      );

      setSuccessMessage(`Order #${response.order.id} created successfully.`);
      router.push("/orders");
      router.refresh();
    } catch (requestError) {
      const message =
        requestError instanceof OrdersApiError
          ? requestError.message
          : "Unable to create the order.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_24%),linear-gradient(180deg,#fff,#f8fafc)] px-6 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Orders
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Create an order
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              This form submits directly to the Orders Service through the shared API layer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LogoutButton />
          </div>
        </div>

        {status === "loading" ? (
          <Alert>
            <AlertTitle>Checking your session</AlertTitle>
            <AlertDescription>Please wait a moment while we load your login state.</AlertDescription>
          </Alert>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Order failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {successMessage ? (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}

        <Card className="border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle>Order details</CardTitle>
            <CardDescription>
              Add items, select a restaurant, and submit to the backend.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurantId">Restaurant ID</Label>
                  <Input
                    id="restaurantId"
                    type="number"
                    min={1}
                    value={restaurantId}
                    onChange={(event) => setRestaurantId(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="deliveryAddress">Delivery address</Label>
                  <Textarea
                    id="deliveryAddress"
                    value={deliveryAddress}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-950">Items</h2>
                    <p className="text-sm text-slate-600">Each item is sent to the Orders Service as JSON.</p>
                  </div>

                  <Button type="button" variant="outline" onClick={addItem}>
                    <Plus className="h-4 w-4" />
                    Add item
                  </Button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor={`item-id-${index}`}>Item ID</Label>
                        <Input
                          id={`item-id-${index}`}
                          type="number"
                          min={1}
                          value={item.id}
                          onChange={(event) => updateItem(index, "id", event.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`item-name-${index}`}>Name</Label>
                        <Input
                          id={`item-name-${index}`}
                          type="text"
                          value={item.name}
                          onChange={(event) => updateItem(index, "name", event.target.value)}
                          placeholder="Burger"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`item-quantity-${index}`}
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) => updateItem(index, "quantity", event.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-price-${index}`}>Price</Label>
                        <Input
                          id={`item-price-${index}`}
                          type="number"
                          step="0.01"
                          min={0}
                          value={item.price}
                          onChange={(event) => updateItem(index, "price", event.target.value)}
                          required
                        />
                      </div>

                      <div className="md:col-span-4">
                        {items.length > 1 ? (
                          <Button type="button" variant="ghost" onClick={() => removeItem(index)}>
                            Remove item
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span>Calculated total</span>
                <span className="text-base font-semibold text-slate-950">
                  ${items
                    .reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0)
                    .toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={isSubmitting || status === "loading"}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating order...
                    </>
                  ) : (
                    "Create order"
                  )}
                </Button>

                <Button type="button" variant="outline" onClick={() => router.push("/orders")}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to orders
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}