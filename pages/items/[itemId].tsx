import ItemForm from "@/components/ItemForm";
import { GetServerSideProps, NextPage } from "next";
import { getItem } from "services/sanity/item";
import { ItemType } from "types";

type PropTypes = {
  //   children: React.ReactNode;
  item: ItemType;
  inProducts: string[];
};

const Item: NextPage<PropTypes> = ({ item, inProducts }) => {
  //   const router = useRouter();
  //   const { itemId } = router.query;

  //   const { data, error, isLoading } = useQuery<ItemType[]>(
  //     ["item", itemId],
  //     () => getItem(itemId as string)
  //   );
  //   if (isLoading) return <p>Loading...</p>;
  //   if (error || data?.length === 0) return <p>Error: Something is wrong...</p>;

  return <ItemForm item={item} inProducts={inProducts} />;
};

export default Item;

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  query,
}) {
  const items = (await getItem(query.itemId as string)) as ItemType[];
  const inProducts =
    items[0].inProduct.length === 0
      ? ([] as string[])
      : items[0].inProduct.map((product) => product._id);
  return {
    props: {
      item: items[0],
      inProducts,
    },
  };
};
