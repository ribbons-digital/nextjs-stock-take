import { rest } from "msw";
import { mockOrders, products } from "./db";

export const handlers = [
  rest.get("/api/products", (req, res, ctx) => {
    return res(ctx.json({ products }));
  }),
  rest.get("/api/orders", (req, res, ctx) => {
    return res(ctx.json({ orders: mockOrders }));
  }),
  // rest.post("/api/products/:id", (req, res, ctx) => {
  //   const { id } = req.params;
  //   const { productId, quantity } = req.body;
  //   console.log(productId);
  //   const product = products.find((p) => p.id === id);

  //   return res(
  //     ctx.json({
  //       product: {
  //         transactionId: "HePqRSIKIpzDxf9dhzESvz",
  //         results: [
  //           {
  //             id: `${productId}`,
  //             document: {
  //               _createdAt: "2022-05-25T03:55:34Z",
  //               _id: `${productId}`,
  //               _rev: "HePqRSIKIpzDxf9dhzESvz",
  //               _type: "item",
  //               _updatedAt: "2022-06-21T11:40:23Z",
  //               name: `${product.name}`,
  //               quantity: `${quantity}`,
  //             },
  //             operation: "update",
  //           },
  //         ],
  //       },
  //     })
  //   );
  // }),
];
