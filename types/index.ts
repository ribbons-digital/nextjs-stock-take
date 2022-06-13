import type { ApiError, User } from "@supabase/supabase-js";

export type ProductType = {
  _id?: string;
  _key?: string;
  name: string;
  items: ItemType[];
  orders: OrderType[];
};

export type OrderType = {
  _id?: string;
  _key?: string;
  orderNumber: string;
  orderedItems: OrderItemType[];
  date: string;
};

export type OrderResponseType = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  date: string;
  orderedItems: OrderItemType[];
};

export type ItemsInProductResponseType = {
  _id: string;
  items: Omit<ItemType, "_key" | "name" | "inProduct">[];
};

export type OrdersInProductResponseType = {
  _id: string;
  orders: OrderType[];
};

export type ItemType = {
  _id?: string;
  _key?: string;
  name: string;
  quantity: number;
  cost: number;
  inProduct: Omit<ProductType, "items" | "orders">[];
};

export type OrderItemType = {
  _id?: string;
  _key?: string;
  orderedItem: ProductType;
  quantity: number;
  note?: string;
};

export type OrderItemParamsType = {
  orderedItem: SanityReferenceType;
  quantity: number;
};

export type CreateProductParamsType = {
  name: string;
  // items: SanityReferenceType[];
};

export type UpdateProductOrdersParamsType = {
  productId: string;
  orders: SanityReferenceType[];
};
export interface CreateOrderParamsType {
  orderedItems: OrderItemParamsType[];
  orderNumber: string;
  date: string;
}

export interface UpdateOrderParamsType {
  orderId: string;
  orderNumber: string;
  orderedItems: {
    orderedItem: SanityReferenceType;
    quantity: number;
  }[];
  date: string;
}

export type CreateItemParamsType = {
  name: string;
  quantity: string;
  cost: number;
};

export type SanityReferenceType = {
  _type: string;
  _ref: string;
};

export type AuthType =
  | {
      user: User | null;
      error?: undefined;
    }
  | {
      user?: undefined;
      error: ApiError | null;
    };
