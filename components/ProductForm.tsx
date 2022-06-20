import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { createProduct, updateProduct } from "services/sanity/product";
import { ItemType, ProductType } from "types";
import ProductItemList from "./ProductItemList";

type ProductFormProps = {
  product?: ProductType;
  items: ItemType[];
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

  const productMutation = useMutation(
    async (productName: string) => {
      const isCreate = router.pathname.includes("new");
      if (isCreate) {
        return await createProduct({
          name: productName,
        });
      } else {
        await updateProduct({
          id: product?._id as string,
          name: productName,
        });
      }
    },
    {
      onSuccess: (data) => {
        router.push(data ? `/products/${data._id}` : "/products");
      },
    }
  );

  const onSubmit = handleSubmit(async (formData: FormData) => {
    const { productName } = formData;

    productMutation.mutate(productName);
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
            value={product?._id}
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
            required: "Please enter a valid email address",
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
              productId={product?._id!}
            />
          </div>
        )}
      </FormControl>
    </form>
  );
}
