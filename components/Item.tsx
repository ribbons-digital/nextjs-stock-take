import { Button, Input, Td, Tr } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { updateItemQuantity } from "services/sanity/item";
import { ItemType } from "types";

export default function Item({
  items,
  index,
}: {
  items: ItemType[];
  index: number;
}) {
  const item = items[index];
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{ quantity: string }>();

  const updateItemQtyMutation = useMutation(
    async ({ quantity }: { quantity: string }) => {
      return await updateItemQuantity({
        id: item._id as string,
        quantity: Number(quantity),
      });
    }
  );

  const onUpdateItemQuantity = handleSubmit(
    ({ quantity }: { quantity: string }) => {
      updateItemQtyMutation.mutate({ quantity });
    }
  );

  return (
    <Tr key={item._id}>
      <Td>
        <button
          type="button"
          name={item.name}
          className="underline underline-offset-1 text-blue-700"
          onClick={() => router.push(`/items/${item._id}`)}
        >
          {item.name}
        </button>
      </Td>

      <td>
        <Input
          type="number"
          defaultValue={item.quantity}
          {...register("quantity", {
            required: "Please enter a valid number",
          })}
          aria-invalid={Boolean(errors.quantity) || undefined}
          aria-describedby={errors.quantity ? "item-name-error" : undefined}
        />
        {errors.quantity ? (
          <p className="text-red-600" role="alert" id="item-name-error">
            {errors.quantity.message}
          </p>
        ) : null}
      </td>
      <td>
        <Button
          type="button"
          onClick={onUpdateItemQuantity}
          colorScheme="twitter"
        >
          {updateItemQtyMutation.isLoading ? "Updating..." : "Update"}
        </Button>
      </td>
    </Tr>
  );
}
