import ItemForm from "@/components/ItemForm";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getItem } from "services/sanity/item";
import { ItemType } from "types";

type PropTypes = {
  children: React.ReactNode;
};

const Item: NextPage<PropTypes> = () => {
  const router = useRouter();
  const { itemId } = router.query;

  const { data, error, isLoading } = useQuery<ItemType[]>(
    ["item", itemId],
    () => getItem(itemId as string)
  );
  if (isLoading) return <p>Loading...</p>;
  if (error || data?.length === 0) return <p>Error: Something is wrong...</p>;

  return <ItemForm item={data![0]} />;
};

export default Item;
