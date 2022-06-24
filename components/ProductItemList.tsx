import {
  Button,
  FormControl,
  FormLabel,
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { addItemInProduct } from "services/sanity/product";
import { ItemType } from "types";
import ProductItem from "./ProductItem";

type ProductItemListProps = {
  currentProductItems: Omit<ItemType, "cost" | "inProduct">[];
  allProductItems: ItemType[];
  productId: string;
};

export default function ProductItemList({
  currentProductItems,
  allProductItems,
  productId,
}: ProductItemListProps) {
  const [items, setItems] =
    React.useState<Omit<ItemType, "cost" | "inProduct">[]>(currentProductItems);
  const [selectedItemId, setSelectedItemId] = React.useState<string>("");

  const queryClient = useQueryClient();

  const updateItemListMutation = useMutation(
    (
      itemRef: {
        _type: string;
        _ref: string;
      }[]
    ) => {
      return addItemInProduct({ id: productId as string, itemRef });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["product", productId]);
        queryClient.invalidateQueries(["items"]);
      },
    }
  );

  React.useEffect(() => {
    setItems(currentProductItems);
  }, [currentProductItems]);

  const handleSelectItem = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItemId(event.target.value);
  };

  return (
    <>
      <FormControl sx={{ py: 1, width: "100%" }}>
        <FormLabel id="demo-simple-select-helper-label" htmlFor="selected-item">
          Item
        </FormLabel>
        <Select
          id="selected-item"
          variant="outline"
          value={selectedItemId}
          onChange={handleSelectItem}
          placeholder="Choose an item"
        >
          <option></option>
          {allProductItems.map((item, i) => (
            <option value={item._id} key={item._id}>
              {item.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button
        className="w-full mb-4"
        variant="outlined"
        name="addItem"
        disabled={!selectedItemId || updateItemListMutation.isLoading}
        onClick={() => {
          const itemRef = [
            {
              _type: "reference",
              _ref: selectedItemId,
            },
          ];
          updateItemListMutation.mutate(itemRef);
        }}
      >
        + Add Item
      </Button>

      {items.length > 0 && (
        <TableContainer>
          <Table>
            {updateItemListMutation.isLoading && (
              <TableCaption>Adding item...</TableCaption>
            )}
            <Thead>
              <Tr>
                <Th>Item Name</Th>
                <Th>Quantity</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((_, i) => (
                <ProductItem
                  items={items}
                  index={i}
                  productId={productId}
                  key={i}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
