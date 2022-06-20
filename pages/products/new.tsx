import ProductForm from "@/components/ProductForm";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { getItems } from "services/sanity/item";
import { ItemType } from "types";

export default function NewProduct({ items }: { items: ItemType[] }) {
  return <ProductForm items={items} />;
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  return {
    props: {
      items: await getItems(),
    },
  };
},
sessionOptions);
