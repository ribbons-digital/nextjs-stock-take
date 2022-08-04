import z from "zod";

export const createItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  cost: z.number(),
  inProducts: z.array(z.string()).optional(),
});

export const updateItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  cost: z.number(),
  inProducts: z.array(z.string()).optional(),
});

export const updateItemQtySchema = z.object({
  id: z.string(),
  quantity: z.number(),
});

export type CreateItemInput = z.TypeOf<typeof createItemSchema>;
export type UpdateItemQtyInput = z.TypeOf<typeof updateItemQtySchema>;

export const getOrDeleteSingleItemSchema = z.object({
  itemId: z.string(),
});
