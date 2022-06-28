import type { SanityDocumentStub } from "@sanity/client";
import type { CreateOrderParamsType, UpdateOrderParamsType } from "../../types";

import { sanity } from "../../lib/sanity-client";

export const getOrders = async () => {
  const query =
    '*[_type == "order"]{ _id, _key, orderNumber, orderedItems[]{ orderedItem->{_id, name}, quantity } , date}';
  return await sanity.fetch(query);
};

export const getOrder = async ({ id }: { id: string }) => {
  const query = `*[_type == "order" && _id == "${id}"]{ _id, _key, orderNumber, orderedItems[]{ _id, orderedItem->{_id, name}, quantity, note } , date}`;
  return await sanity.fetch(query);
};

export const createOrder = async ({
  orderedItems,
  orderNumber,
  date,
}: CreateOrderParamsType) => {
  const order: SanityDocumentStub = {
    _type: "order",
    orderedItems,
    date,
    orderNumber,
  };
  const newOrder = await sanity.create(order, {
    autoGenerateArrayKeys: true,
  });

  return newOrder;
};

export const updateOrder = async ({
  orderId,
  orderedItems,
  date,
  orderNumber,
}: UpdateOrderParamsType) => {
  return await sanity
    .patch(orderId)
    .set({ orderedItems, date, orderNumber })
    .commit({ autoGenerateArrayKeys: true });
};

export const deleteOrder = async ({ id }: { id: string }) => {
  if (!id) return { error: "Please provide object with id key" };
  return await sanity.delete(id);
};
