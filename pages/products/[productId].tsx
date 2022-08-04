import type { GetServerSideProps, NextPage } from "next";

import ProductForm from "@/components/ProductForm";
import { Item } from "@prisma/client";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

type PropTypes = {
  children: React.ReactNode;
};

const Product: NextPage<PropTypes> = () => {
  const router = useRouter();
  const { productId } = router.query;
  const { data, error, isLoading } = trpc.useQuery([
    "products.single-product",
    { productId: productId as string },
  ]);
  const {
    data: items,
    error: itemsError,
    isLoading: itemsLoading,
  } = trpc.useQuery(["items.items"]);
  if (isLoading || itemsLoading) return <p>Loading...</p>;
  if (error || itemsError || !data || items?.length === 0)
    return <p>Error: Something is wrong...</p>;

  const filteredItems =
    data.items && data.items.length > 0
      ? items?.filter(
          (item: Item) => !data.items.some((pItem) => pItem.id === item.id)
        )
      : items;
  console.log(filteredItems);
  return <ProductForm product={data} items={filteredItems as Item[]} />;
};

export default Product;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  function ({ req, res, params }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };

    // const { productId } = params as QParams;

    // const getProductQuery = `*[_type == "product" && _id == "${productId}"]{ _id, _key, name, items[]->{_id, _key, name, quantity}, orders[]->{_id, orderNumber} }`;
    // const getItemsQuery =
    //   '*[_type == "item"]{ _id, _key, name, quantity, cost, "inProduct": *[_type=="product" && references(^._id)]{ _id, name } }';

    // const products = await sanity.fetch(getProductQuery);
    // const items = await sanity.fetch(getItemsQuery);

    // const filteredItems =
    //   products[0].items && products[0].items.length > 0
    //     ? items.filter(
    //         (item: ItemType) =>
    //           !products[0].items.some(
    //             (pItem: ItemType) => pItem._id === item._id
    //           )
    //       )
    //     : items;
    // return {
    //   props: {
    //     product: products[0],
    //     items: filteredItems,
    //   },
    // };
  },
  sessionOptions
);
