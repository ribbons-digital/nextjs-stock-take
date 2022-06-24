import { Button, Td, Tr } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { deleteItemInProduct } from "services/sanity/product";
import { ItemType } from "types";

export default function ProductItem({
  items,
  index,
  productId,
}: {
  items: Omit<ItemType, "cost" | "inProduct">[];
  index: number;
  productId: string;
}) {
  const item = items[index];
  const queryClient = useQueryClient();

  const deleteItemFromList = useMutation(
    ({ itemId }: { itemId: string }) => {
      const index = items.findIndex(
        (item: Omit<ItemType, "cost" | "inProduct">) => item._id === itemId
      );
      return deleteItemInProduct({ id: productId as string, index });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["product", productId]);
        queryClient.invalidateQueries(["items"]);
      },
    }
  );
  return (
    <Tr key={item._id}>
      <Td>{item.name}</Td>
      <Td>{item.quantity}</Td>
      <td>
        <Button
          className="text-white"
          variant="solid"
          colorScheme="red"
          name="deleteItem"
          type="button"
          isLoading={deleteItemFromList.isLoading}
          disabled={deleteItemFromList.isLoading}
          onClick={() =>
            deleteItemFromList.mutate({
              itemId: item._id as string,
            })
          }
        >
          Delete
        </Button>
      </td>
    </Tr>
  );
}
