import { Input, Td, Tr } from "@chakra-ui/react";
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
    // async ({ id, qty }: { id: string; qty: number }) => {
    //   return await fetch(`/api/products/${product._id}`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ productId: id, quantity: qty }),
    //   });
    // },
    {
      onSuccess: () => queryClient.invalidateQueries(["products"]),
    }
  );
  return (
    <Tr key={product._id}>
      <Td>
        <button
          type="button"
          name={product.name}
          className="underline underline-offset-1 text-blue-700"
          onClick={() => router.push(`/products/${product._id}`)}
        >
          {product.name}
        </button>
      </Td>
      <Td>
        <label htmlFor={`quantity-input-${product.name}`} />
        <Input
          id={`quantity-input-${product.name}`}
          name={`quantity-input-${product.name}`}
          data-testid={`quantity-input-${product.name}`}
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
            data-testid={`update-quantity-${product.name}`}
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
