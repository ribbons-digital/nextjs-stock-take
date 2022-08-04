import ItemForm from "@/components/ItemForm";
import { Item, Product } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { prisma } from "../../utils/prisma";

type PropTypes = {
  //   children: React.ReactNode;
  item:
    | (Item & {
        inProducts: Product[];
      })
    | null;
  inProducts: string[];
};

const ItemPage: NextPage<PropTypes> = ({ item, inProducts }) => {
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

export default ItemPage;

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  query,
}) {
  const item = await prisma.item.findUnique({
    where: {
      id: query.itemId as string,
    },
    include: {
      inProducts: true,
    },
  });
  console.log(item);

  const inProducts =
    item?.inProducts.length === 0
      ? ([] as string[])
      : item?.inProducts.map((product) => product.id);
  return {
    props: {
      item,
      inProducts,
    },
  };
};
