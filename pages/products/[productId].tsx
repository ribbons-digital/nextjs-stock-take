import type { GetServerSideProps, NextPage } from "next";

import ProductForm from "@/components/ProductForm";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getItems } from "services/sanity/item";
import { getProduct } from "services/sanity/product";
import { ItemType, ProductType } from "types";

type PropTypes = {
  children: React.ReactNode;
};

const Product: NextPage<PropTypes> = () => {
  const router = useRouter();
  const { productId } = router.query;
  const { data, error, isLoading } = useQuery<ProductType[]>(
    ["product", productId],
    () => getProduct({ id: productId as string })
  );
  const {
    data: items,
    error: itemsError,
    isLoading: itemsLoading,
  } = useQuery<ItemType[]>(["items"], () => getItems());
  if (isLoading || itemsLoading) return <p>Loading...</p>;
  if (error || itemsError || data?.length === 0 || items?.length === 0)
    return <p>Error: Something is wrong...</p>;

  const filteredItems =
    data![0].items && data![0].items.length > 0
      ? items?.filter(
          (item: ItemType) =>
            !data![0].items.some(
              (pItem: Omit<ItemType, "cost" | "inProduct">) =>
                pItem._id === item._id
            )
        )
      : items;

  return <ProductForm product={data![0]} items={filteredItems as ItemType[]} />;
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
