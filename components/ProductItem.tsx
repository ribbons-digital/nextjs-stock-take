import { Button, Td, Tr } from "@chakra-ui/react";
import { Item } from "@prisma/client";
import { useQueryClient } from "react-query";
import { trpc } from "utils/trpc";

export default function ProductItem({
  items,
  index,
  productId,
}: {
  items: Item[];
  index: number;
  productId: string;
}) {
  const item = items[index];
  const queryClient = useQueryClient();

  const deleteItemFromList = trpc.useMutation(
    ["products.remove-item-from-product"],
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["products.single-product"]);
        // queryClient.invalidateQueries(["items"]);
      },
    }
  );
  return (
    <Tr key={item.id}>
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
              itemId: item.id as string,
              productId: productId as string,
            })
          }
        >
          Delete
        </Button>
      </td>
    </Tr>
  );
}
