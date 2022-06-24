import ProductForm from "@/components/ProductForm";
import { NextPage } from "next";
import { useQuery } from "react-query";
import { getItems } from "services/sanity/item";
import { ItemType } from "types";

type PropTypes = {
  children: React.ReactNode;
};

const NewProduct: NextPage<PropTypes> = () => {
  const { data, error, isLoading } = useQuery<ItemType[]>(["items"], () =>
    getItems()
  );
  if (isLoading) return <p>Loading...</p>;
  if (error || data?.length === 0) return <p>Error: Something is wrong...</p>;

  return <ProductForm items={data as ItemType[]} />;
};

export default NewProduct;
