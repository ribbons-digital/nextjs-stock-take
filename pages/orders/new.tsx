import OrderForm from "@/components/OrderForm";
import { Product } from "@prisma/client";
import { NextPage } from "next";
import { trpc } from "utils/trpc";

type PropTypes = {
  children: React.ReactNode;
};

const NewOrder: NextPage<PropTypes> = () => {
  const { data, error, isLoading } = trpc.useQuery(["products.products"]);
  if (isLoading) return <p>Loading...</p>;
  if (error || data?.length === 0) return <p>Error: Something is wrong...</p>;

  return <OrderForm products={data as Product[]} />;
};

export default NewOrder;
