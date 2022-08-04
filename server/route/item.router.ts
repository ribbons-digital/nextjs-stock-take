import {
  createItemSchema,
  getOrDeleteSingleItemSchema,
  updateItemQtySchema,
  updateItemSchema,
} from "../../schema/item.schema";
import { createRouter } from "../createRouter";

export const itemRouter = createRouter()
  .mutation("create-item", {
    input: createItemSchema,
    resolve: async ({ ctx, input }) => {
      let item;
      item = await ctx.prisma.item.create({
        data: {
          cost: input.cost,
          name: input.name,
          quantity: input.quantity,
        },
      });

      if (input.inProducts) {
        await ctx.prisma.item.update({
          where: {
            id: item.id,
          },
          data: {
            inProducts: {
              connect: input.inProducts.map((productId) => ({
                id: productId,
              })),
            },
          },
        });
      }

      return item;
    },
  })
  .mutation("update-item-quantity", {
    input: updateItemQtySchema,
    resolve: async ({ ctx, input }) => {
      const item = await ctx.prisma.item.update({
        where: {
          id: input.id,
        },
        data: {
          quantity: input.quantity,
        },
      });
      return item;
    },
  })
  .mutation("update-item", {
    input: updateItemSchema,
    resolve: async ({ ctx, input }) => {
      let item;
      item = await ctx.prisma.item.update({
        where: {
          id: input.id,
        },
        data: {
          cost: input.cost,
          name: input.name,
          quantity: input.quantity,
        },
      });
      if (input.inProducts) {
        await ctx.prisma.item.update({
          where: {
            id: item.id,
          },
          data: {
            inProducts: {
              connect: input.inProducts.map((productId) => ({
                id: productId,
              })),
            },
          },
        });
      }
      return item;
    },
  })
  .mutation("delete-item", {
    input: getOrDeleteSingleItemSchema,
    resolve: async ({ ctx, input }) => {
      const item = await ctx.prisma.item.delete({
        where: {
          id: input.itemId,
        },
      });
      return item;
    },
  })
  .query("items", {
    resolve: async ({ ctx }) => {
      return ctx.prisma.item.findMany({
        include: {
          inProducts: true,
        },
      });
    },
  })
  .query("single-item", {
    input: getOrDeleteSingleItemSchema,
    resolve: async ({ ctx, input }) => {
      const { itemId } = input;

      return await ctx.prisma.item.findFirst({
        where: {
          id: itemId,
        },
        include: {
          inProducts: true,
        },
      });
    },
  });
