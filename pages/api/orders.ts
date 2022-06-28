import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import type { NextApiRequest, NextApiResponse } from "next";
import { getOrders } from "services/sanity/order";
import { OrderType } from "types";

export type OrdersResType = {
  orders: OrderType[];
  error?: string;
};

export default withIronSessionApiRoute(ordersRoute, sessionOptions);

async function ordersRoute(
  req: NextApiRequest,
  res: NextApiResponse<OrdersResType>
) {
  try {
    const orders = await getOrders();
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({
      orders: [],
      error: "Internal Server Error",
    });
  }
}
