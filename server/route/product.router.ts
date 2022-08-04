import {
  addItemInProductsSchema,
  createProductSchema,
  getOrDeleteSingleProductSchema,
  removeItemFromProductSchema,
  updateProductSchema,
} from "schema/product.schema";
import { createRouter } from "../createRouter";

export const productRouter = createRouter()
  .mutation("create-product", {
    input: createProductSchema,
    resolve: async ({ ctx, input }) => {
      //   if (!ctx.user) {
      //     new trpc.TRPCError({
      //       code: "FORBIDDEN",
      //       message: "You are not authorized to perform this action",
      //     });
      //   }
      const product = await ctx.prisma.product.create({
        data: {
          ...input,
        },
      });
      return product;
    },
  })
  .mutation("update-product", {
    input: updateProductSchema,
    resolve: async ({ ctx, input }) => {
      let product;
      product = await ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });

      if (input.items) {
        await ctx.prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            items: {
              connect: input.items.map((itemId) => ({
                id: itemId,
              })),
            },
          },
        });
      }
      return product;
    },
  })
  .mutation("remove-item-from-product", {
    input: removeItemFromProductSchema,
    resolve: async ({ ctx, input }) => {
      const product = await ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          items: {
            disconnect: {
              id: input.itemId,
            },
          },
        },
      });
      return product;
    },
  })
  .mutation("add-item-in-products", {
    input: addItemInProductsSchema,
    resolve: async ({ ctx, input }) => {
      const allItems = await ctx.prisma.item.findMany();
      const item = allItems.filter((item) => item.id === input.item);
      const products = await Promise.all(
        input.productIds.map(async (productId) => {
          const product = await ctx.prisma.product.update({
            where: {
              id: productId,
            },
            data: {
              items: {
                create: item,
              },
            },
          });
          return product;
        })
      );

      return products;
    },
  })
  .mutation("delete-product", {
    input: getOrDeleteSingleProductSchema,
    resolve: async ({ ctx, input }) => {
      const product = await ctx.prisma.product.delete({
        where: {
          id: input.productId,
        },
      });
      return product;
    },
  })
  .query("products", {
    resolve: async ({ ctx, input }) => {
      return ctx.prisma.product.findMany({
        include: {
          items: true,
          orders: true,
        },
      });
    },
  })
  .query("single-product", {
    input: getOrDeleteSingleProductSchema,
    resolve: async ({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: {
          id: input.productId,
        },
        include: {
          items: true,
          orders: true,
        },
      });
    },
  });
