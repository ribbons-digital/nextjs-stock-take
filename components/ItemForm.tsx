import { Button, Checkbox, Input, Stack } from "@chakra-ui/react";
import { Item, Product } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { trpc } from "utils/trpc";

type ItemFormProps = {
  item?:
    | (Item & {
        inProducts: Product[];
      })
    | null;
  inProducts?: string[];
};

type FormData = {
  itemName: string;
  quantity: string;
  inProducts?: string[];
  costPerItem: string;
};

type NestedFormData = {
  productName: string;
};

export default function ItemForm({ item, inProducts }: ItemFormProps) {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>(
    item ? (inProducts as string[]) : []
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();

  const {
    handleSubmit: nestedSubmit,
    register: nestedRegister,
    formState: { errors: nestedErrors, isDirty, isValid },
    reset,
  } = useForm<NestedFormData>();

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = trpc.useQuery(["products.products"]);

  const createProductMutation = trpc.useMutation(["products.create-product"], {
    onSuccess: () => {
      queryClient.invalidateQueries(["products.products"]);
      reset();
    },
  });

  const createItemMutaiton = trpc.useMutation(["items.create-item"], {
    onSuccess: (data) => {
      router.push(data ? `/items/${data.id}` : "/items");
    },
  });

  const updateItemMutaiton = trpc.useMutation(["items.update-item"], {
    onSuccess: async () => {
      // const original = item?.inProducts.map((product) => product.id);
      // const toRemoveFrom = original?.filter(
      //   (it) => !selectedProducts.includes(it as string)
      // );
      // const toAddTo = selectedProducts.filter(
      //   (it) => !original?.includes(it)
      // );

      // if (toRemoveFrom && toRemoveFrom?.length > 0) {
      //   await Promise.all(
      //     toRemoveFrom.map(async (product) => {
      //       const prod = data?.find((p) => p.id === product);
      //       const index = prod?.items.findIndex((it) => it.id === item?.id);
      //       await deleteItemInProduct({
      //         id: product as string,
      //         index: index as number,
      //       });
      //     })
      //   );
      // }

      // toAddTo.map(async (product) => {
      //   await addItemInProduct({
      //     id: product,
      //     itemRef: [
      //       {
      //         _type: "reference",
      //         _ref: item?.id as string,
      //       },
      //     ],
      //   });
      // });
      router.push("/items");
    },
  });

  const deleteItemMutation = trpc.useMutation(["items.delete-item"], {
    onSuccess: () => {
      router.push("/items");
    },
  });

  const onCreateItem = handleSubmit(
    async (formData: Omit<FormData, "inProducts">) => {
      const { itemName, quantity, costPerItem } = formData;

      createItemMutaiton.mutate({
        name: itemName,
        quantity: Number(quantity),
        cost: Number(costPerItem),
        inProducts: selectedProducts,
      });
    }
  );

  const onUpdateItem = handleSubmit(async (formData: FormData) => {
    const { itemName, quantity, costPerItem } = formData;

    updateItemMutaiton.mutate({
      id: item?.id as string,
      name: itemName,
      quantity: Number(quantity),
      cost: Number(costPerItem),
      inProducts: selectedProducts,
    });
  });

  const onDeleteItem = () => {
    if (item) {
      deleteItemMutation.mutate({ itemId: item.id });
    }
  };

  const onAddProduct = nestedSubmit(async (nestedFormData: NestedFormData) => {
    createProductMutation.mutate({ name: nestedFormData.productName });
  });

  const onSelectProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = selectedProducts.indexOf(e.target.value);
    if (index > -1) {
      const updatedProducts = selectedProducts.filter((p, i) => i !== index);
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([...selectedProducts, e.target.value]);
    }
    // const products = Array.from(
    //   e.target.selectedOptions,
    //   (option) => option.value
    // );
    // setSelectedProducts(products);
  };

  return (
    <form>
      <div className="flex flex-col max-w-4xl mx-auto p-4">
        <div className="w-full flex justify-between mb-2">
          <Button type="button" onClick={() => router.back()}>
            Go back
          </Button>
          <div>
            {createItemMutaiton.isLoading || updateItemMutaiton.isLoading ? (
              <Button
                variant="solid"
                colorScheme="twitter"
                type="button"
                disabled={
                  createItemMutaiton.isLoading || updateItemMutaiton.isLoading
                }
              >
                {item ? "Updating..." : "Creating..."}
              </Button>
            ) : (
              <>
                <Button
                  variant="solid"
                  colorScheme="twitter"
                  type="button"
                  onClick={item ? onUpdateItem : onCreateItem}
                >
                  {item ? "Update" : "Create"}
                </Button>
                <Button
                  variant="solid"
                  colorScheme="red"
                  type="button"
                  className="ml-2"
                  onClick={onDeleteItem}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
        <label htmlFor="item-name" className="text-xl font-bold mt-8">
          Item Name:
        </label>
        <Input
          id="item-name"
          type="text"
          sx={{ py: 1, width: "100%" }}
          {...register("itemName", {
            required: "The field can't be empty",
          })}
          defaultValue={item?.name}
          aria-invalid={Boolean(errors.itemName) || undefined}
          aria-describedby={errors.itemName ? "item-name-error" : undefined}
        />
        {errors.itemName ? (
          <p className="text-red-600" role="alert" id="item-name-error">
            {errors.itemName.message}
          </p>
        ) : null}

        <label htmlFor="quanitty" className="text-xl font-bold mt-8">
          Quantity:
        </label>
        <Input
          type="text"
          id="quanitty"
          {...register("quantity", {
            required: "The field can't be empty",
          })}
          defaultValue={String(item?.quantity ?? "")}
          className="border-2"
          aria-invalid={Boolean(errors.quantity) || undefined}
          aria-describedby={errors.quantity ? "order-date-error" : undefined}
        />
        {errors.quantity ? (
          <p className="text-red-600" role="alert" id="order-date-error">
            {errors.quantity.message}
          </p>
        ) : null}

        <div className="text-xl font-bold mt-8 mb-4">In Product:</div>

        <div className="px-2">
          <>
            <label htmlFor="select-existing-products" className="my-2">
              Select existing products:
            </label>
            {(isLoading || createProductMutation.isLoading) && (
              <div>Fetching products...</div>
            )}
            {error && <p>Something is wrong...</p>}
            {data && !createProductMutation.isLoading && (
              <Stack
                id="select-existing-products"
                spacing={5}
                direction="column"
                sx={{
                  height: "12rem",
                  overflow: "scroll",
                  border: "1px",
                  p: 2,
                  borderColor: "gray",
                }}
              >
                {data.map((product) => (
                  <Checkbox
                    key={product.id}
                    value={product.id}
                    {...register("inProducts", {
                      onChange: onSelectProducts,
                      required: true,
                    })}
                    isChecked={selectedProducts.includes(product.id as string)}
                  >
                    {product.name}
                  </Checkbox>
                ))}
              </Stack>
            )}
            {errors.inProducts ? (
              <p className="text-red-600" role="alert" id="order-date-error">
                Please select one or more products
              </p>
            ) : null}

            <label htmlFor="add-new-product" className="my-2">
              Add a new product:
            </label>
            <div className="flex item-center">
              <div className="flex flex-col w-full">
                <Input
                  id="add-new-product"
                  type="text"
                  {...nestedRegister("productName", {
                    required: "Please enter a product name",
                  })}
                  sx={{ py: 1 }}
                />
                <p className="text-red-600" role="alert">
                  {nestedErrors.productName && nestedErrors.productName.message}
                </p>
              </div>
              <Button
                type="button"
                onClick={onAddProduct}
                disabled={!isDirty}
                sx={{ ml: 4 }}
              >
                {createProductMutation.isLoading ? "Add..." : "Add Product"}
              </Button>
            </div>
          </>
        </div>

        <label htmlFor="costPerItem" className="text-xl font-bold mt-8">
          Cost:
        </label>
        <Input
          type="text"
          id="costPerItem"
          {...register("costPerItem", {
            required: "The field can't be empty",
          })}
          defaultValue={String(item?.cost ?? "")}
          className="border-2"
          aria-invalid={Boolean(errors.costPerItem) || undefined}
          aria-describedby={errors.costPerItem ? "order-date-error" : undefined}
        />
        {errors.costPerItem ? (
          <p className="text-red-600" role="alert" id="order-date-error">
            {errors.costPerItem.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
