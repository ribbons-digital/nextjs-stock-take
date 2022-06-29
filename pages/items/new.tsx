import ItemForm from "@/components/ItemForm";
import { NextPage } from "next";

type PropTypes = {
  children: React.ReactNode;
};

const NewItem: NextPage<PropTypes> = () => {
  return <ItemForm />;
};

export default NewItem;
