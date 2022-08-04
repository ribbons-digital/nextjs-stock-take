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
import { Item, Product } from "@prisma/client";
import React from "react";
import { useQueryClient } from "react-query";
import { trpc } from "utils/trpc";
import ProductItem from "./ProductItem";

type ProductItemListProps = {
  currentProductItems: Item[];
  allProductItems: Item[];
  product: Product;
};

export default function ProductItemList({
  currentProductItems,
  allProductItems,
  product,
}: ProductItemListProps) {
  const [items, setItems] = React.useState<Item[]>(currentProductItems);
  const [selectedItemId, setSelectedItemId] = React.useState<string>("");
  const productId = product.id;
  const queryClient = useQueryClient();

  const updateItemListMutation = trpc.useMutation(["products.update-product"], {
    onSuccess: () => {
      queryClient.invalidateQueries(["products.single-product"]);
      // trpc.useQuery(["items.items"]);
    },
  });

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
            <option value={item.id} key={item.id}>
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
          updateItemListMutation.mutate({
            id: productId,
            name: product.name,
            items: [selectedItemId],
          });
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
