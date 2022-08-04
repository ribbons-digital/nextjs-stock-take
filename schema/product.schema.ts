import z from "zod";

export const createProductSchema = z.object({
  name: z.string(),
});

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(z.string()).optional(),
});
export const addItemInProductsSchema = z.object({
  productIds: z.array(z.string()),
  item: z.string(),
});

export const removeItemFromProductSchema = z.object({
  itemId: z.string(),
  productId: z.string(),
});

export type CreateOrderInput = z.TypeOf<typeof createProductSchema>;
export type updateOrderInput = z.TypeOf<typeof updateProductSchema>;

export const getOrDeleteSingleProductSchema = z.object({
  productId: z.string(),
});
