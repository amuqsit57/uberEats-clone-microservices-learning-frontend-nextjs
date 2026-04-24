export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export type Order = {
  id: number;
  userId: number;
  restaurantId: number;
  items: OrderItem[];
  deliveryAddress: string;
  totalPrice: number;
  status: OrderStatus;
  userEmail?: string | null;
  userName?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrdersResponse = {
  message: string;
  count: number;
  orders: Order[];
};

export type OrderResponse = {
  message: string;
  order: Order;
};

export type CreateOrderPayload = {
  items: OrderItem[];
  restaurantId: number;
  deliveryAddress: string;
  totalPrice: number;
};

const ORDERS_BASE_URL = process.env.NEXT_PUBLIC_ORDERS_BASE_URL ?? "http://localhost:5001";

export class OrdersApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "OrdersApiError";
    this.status = status;
    this.details = details;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message?: unknown }).message ?? "Request failed")
        : "Request failed";

    throw new OrdersApiError(message, response.status, payload);
  }

  return payload as T;
}

async function ordersRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const response = await fetch(`${ORDERS_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  return parseResponse<T>(response);
}

export function getOrdersBaseUrl() {
  return ORDERS_BASE_URL;
}

export async function getHealth() {
  return ordersRequest<{ status: string }>("/health");
}

export async function createOrder(payload: CreateOrderPayload, token?: string | null) {
  return ordersRequest<OrderResponse>(
    "/api/orders",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function getMyOrders(token?: string | null) {
  return ordersRequest<OrdersResponse>("/api/orders/user/my-orders", {}, token);
}

export async function getAllOrders(token?: string | null) {
  return ordersRequest<OrdersResponse>("/api/orders", {}, token);
}

export async function getOrderById(orderId: number | string, token?: string | null) {
  return ordersRequest<OrderResponse>(`/api/orders/${orderId}`, {}, token);
}

export async function updateOrderStatus(
  orderId: number | string,
  status: OrderStatus,
  token?: string | null,
) {
  return ordersRequest<OrderResponse>(
    `/api/orders/${orderId}`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    },
    token,
  );
}

export async function deleteOrder(orderId: number | string, token?: string | null) {
  return ordersRequest<OrderResponse>(
    `/api/orders/${orderId}`,
    {
      method: "DELETE",
    },
    token,
  );
}