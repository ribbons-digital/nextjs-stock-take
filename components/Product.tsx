import { Input, Td, Tr } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateProductItemsQuantity } from "services/sanity/product";
import { ProductType } from "types";

export default function Product({
  products,
  index,
}: {
  products: ProductType[];
  index: number;
}) {
  const product = products[index];
  const router = useRouter();
  const queryClient = useQueryClient();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const updateProductQuantityMutation = useMutation(
    ({ id, qty }: { id: string; qty: number }) => {
      return updateProductItemsQuantity(id, qty);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["products"]),
    }
  );
  return (
    <Tr key={product._id}>
      <Td>
        <Link href={`/products/${product._id}`}>
          <button
            type="button"
            className="underline underline-offset-1 text-blue-700"
          >
            {product.name}
          </button>
        </Link>
      </Td>
      <Td>
        <label htmlFor={`item-quantity-${index}`} />
        <Input
          id={`item-quantity-${index}`}
          name={`item-quantity-${index}`}
          type="number"
          ref={inputRef}
          defaultValue={
            product.items && product.items.length === 1
              ? product.items[0].quantity
              : "0"
          }
          disabled={product.name.toLowerCase().includes("kit")}
        />
      </Td>
      <td>
        {product.orders && product.orders.length > 0 ? (
          <button
            className="underline underline-offset-1 text-blue-700 w-full"
            name="orders"
            type="button"
            onClick={() => router.push(`/products/${product._id}/orders`)}
          >
            {product.orders.length}
          </button>
        ) : (
          <button disabled className="w-full">
            0
          </button>
        )}
      </td>
      <td>
        {!product.name.toLowerCase().includes("kit") && (
          <button
            className="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center w-full"
            type="button"
            name="update"
            onClick={() =>
              updateProductQuantityMutation.mutate({
                id: product._id as string,
                qty: Number(inputRef.current?.value),
              })
            }
          >
            {updateProductQuantityMutation.isLoading ? "Updating..." : "Update"}
          </button>
        )}
      </td>
    </Tr>
  );
}
