import OrderForm from "@/components/OrderForm";
import { NextPage } from "next";
import { useQuery } from "react-query";
import { getProducts } from "services/sanity/product";
import { ProductType } from "types";

type PropTypes = {
  children: React.ReactNode;
};

const NewOrder: NextPage<PropTypes> = () => {
  const { data, error, isLoading } = useQuery<ProductType[]>(["products"], () =>
    getProducts()
  );
  if (isLoading) return <p>Loading...</p>;
  if (error || data?.length === 0) return <p>Error: Something is wrong...</p>;

  return <OrderForm products={data as ProductType[]} />;
};

export default NewOrder;
