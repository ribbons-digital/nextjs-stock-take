import { OrderedItem } from "@prisma/client";
import {
  createOrderSchema,
  getOrDeleteSingleOrderSchema,
  removeProductFromOrderSchema,
  updateOrderSchema,
} from "schema/order.schema";
import { createRouter } from "../createRouter";

export const orderRouter = createRouter()
  .mutation("create-order", {
    input: createOrderSchema,
    resolve: async ({ ctx, input }) => {
      const orderedItems = (await Promise.all(
        input.orderedProducts.map(async (product) => {
          return await ctx.prisma.orderedItem.create({
            data: {
              productId: product.productId,
              quantity: product.quantity,
              note: product.note ?? "",
            },
          });
        })
      )) as OrderedItem[];
      const order = await ctx.prisma.order.create({
        data: {
          orderNumber: input.orderNumber,
          date: new Date(input.date),
          orderedItems: {
            connect: orderedItems.map((item) => ({
              id: item.id,
            })),
          },
        },
      });
      return order;
    },
  })
  .mutation("update-order", {
    input: updateOrderSchema,
    resolve: async ({ ctx, input }) => {
      const orderedItems = (await Promise.all(
        input.orderedProducts.map(async (product) => {
          return await ctx.prisma.orderedItem.create({
            data: {
              productId: product.productId,
              quantity: product.quantity,
              note: product.note ?? "",
            },
          });
        })
      )) as OrderedItem[];
      const order = await ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          orderNumber: input.orderNumber,
          date: new Date(input.date),
          orderedItems: {
            connect: orderedItems.map((item) => ({
              id: item.id,
            })),
          },
        },
      });
      return order;
    },
  })
  .mutation("remove-product-from-order", {
    input: removeProductFromOrderSchema,
    resolve: async ({ ctx, input }) => {
      const order = await ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          orderedItems: {
            disconnect: {
              id: input.productId,
            },
          },
        },
      });
      return order;
    },
  })
  .mutation("delete-order", {
    input: getOrDeleteSingleOrderSchema,
    resolve: async ({ ctx, input }) => {
      const order = await ctx.prisma.order.delete({
        where: {
          id: input.orderId,
        },
      });
      return order;
    },
  })
  .query("orders", {
    resolve: async ({ ctx, input }) => {
      const orders = await ctx.prisma.order.findMany({
        include: {
          orderedItems: true,
        },
      });
      return orders;
    },
  })
  .query("single-order", {
    input: getOrDeleteSingleOrderSchema,
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.order.findUnique({
        where: {
          id: input.orderId,
        },
        include: {
          orderedItems: true,
        },
      });
    },
  });
