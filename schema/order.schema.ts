import z from "zod";

export const createOrderSchema = z.object({
  orderNumber: z.string(),
  date: z.date(),
  orderedProducts: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
      note: z.string().optional(),
    })
  ),
});

export const updateOrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  date: z.date(),
  orderedProducts: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
      note: z.string().optional(),
    })
  ),
});

export const updateOrderQtySchema = z.object({
  id: z.string(),
  date: z.date(),
  orderedProducts: z.array(z.string()),
});

export const removeProductFromOrderSchema = z.object({
  productId: z.string(),
  id: z.string(),
});

export type CreateOrderInput = z.TypeOf<typeof createOrderSchema>;
export type updateOrderInput = z.TypeOf<typeof updateOrderSchema>;
export type UpdateOrderQtyInput = z.TypeOf<typeof updateOrderQtySchema>;

export const getOrDeleteSingleOrderSchema = z.object({
  orderId: z.string(),
});
