import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import type { NextApiRequest, NextApiResponse } from "next";
import { updateProductItemsQuantity } from "services/sanity/product";

export default withIronSessionApiRoute(productsRoute, sessionOptions);

async function productsRoute(
  req: NextApiRequest,
  res: NextApiResponse<
    {
      product:
        | ({
            [x: string]: any;
          } & {
            _id: string;
            _rev: string;
            _type: string;
            _createdAt: string;
            _updatedAt: string;
          })[]
        | null;
    } & { error?: string }
  >
) {
  const { productId, quantity } = req.body;

  if (quantity && req.method === "POST") {
    try {
      res.status(200).json({
        product: await updateProductItemsQuantity(
          productId as string,
          Number(quantity)
        ),
      });
    } catch (error) {
      res.status(500).json({
        product: null,
        error: "Internal Server Error",
      });
    }
  }
}
