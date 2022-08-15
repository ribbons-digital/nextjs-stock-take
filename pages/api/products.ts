import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import type { NextApiRequest, NextApiResponse } from "next";
import { getProducts } from "services/sanity/product";

export type ProductsResType = {
  products: Awaited<ReturnType<typeof getProducts>>;
  error?: string;
};

export default withIronSessionApiRoute(productsRoute, sessionOptions);

async function productsRoute(
  req: NextApiRequest,
  res: NextApiResponse<ProductsResType>
) {
  try {
    const products = await getProducts();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({
      products: [],
      error: "Internal Server Error",
    });
  }
}
