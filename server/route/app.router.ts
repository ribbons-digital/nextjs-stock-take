import { createRouter } from "../createRouter";
import { itemRouter } from "./item.router";
import { orderRouter } from "./order.router";
import { productRouter } from "./product.router";

export const appRouter = createRouter()
  .merge("items.", itemRouter)
  .merge("products.", productRouter)
  .merge("orders.", orderRouter);

export type AppRouter = typeof appRouter;
