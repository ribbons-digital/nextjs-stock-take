import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Item, Order, Product } from "@prisma/client";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { trpc } from "utils/trpc";
import ProductItemList from "./ProductItemList";

type ProductFormProps = {
  product?: Product & { items: Item[]; orders: Order[] };
  items: Item[];
};

type FormData = {
  productName: string;
};

export default function ProductForm({ product, items }: ProductFormProps) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const mutationType = product
    ? "products.update-product"
    : "products.create-product";

  const productMutation = trpc.useMutation([mutationType], {
    onSuccess: (data) => {
      router.push(data ? `/products/${data.id}` : "/products");
    },
  });

  const onSubmit = handleSubmit(async (formData: FormData) => {
    const { productName } = formData;

    const mutationParams = product
      ? {
          id: product.id,
          name: productName,
        }
      : {
          name: productName,
        };

    productMutation.mutate(mutationParams);
  });

  return (
    <form onSubmit={onSubmit}>
      <FormControl className="container mx-auto max-w-4xl p-4">
        <div className="w-full flex justify-between mb-2">
          <Button type="button" onClick={() => router.back()}>
            Go back
          </Button>
          <Button
            variant="solid"
            colorScheme="blue"
            name="submit"
            type="submit"
            value={product?.id}
            isLoading={productMutation.isLoading}
            disabled={productMutation.isLoading}
          >
            {product ? "Update" : "Add"}
          </Button>
        </div>
        <FormLabel htmlFor="product-name">Product Name</FormLabel>
        <Input
          id="product-name"
          type="text"
          {...register("productName", {
            required: "Please enter a product name",
          })}
          defaultValue={product?.name}
          sx={{ py: 1 }}
        />
        <p className="text-red-600" role="alert">
          {errors.productName && errors.productName.message}
        </p>

        {product && (
          <div className="w-full mt-6">
            <label id="items" className="text-xl font-bold">
              Item(s):
            </label>
            <Divider className="my-2" />

            <ProductItemList
              currentProductItems={product?.items ?? []}
              allProductItems={items}
              product={product}
            />
          </div>
        )}
      </FormControl>
    </form>
  );
}
