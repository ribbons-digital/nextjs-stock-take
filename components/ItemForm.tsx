import { Button, Input, Select } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createItem, updateItem } from "services/sanity/item";
import {
  addItemInProduct,
  createProduct,
  getProducts,
} from "services/sanity/product";
import { ItemType } from "types";

type ItemFormProps = {
  item?: ItemType;
};

type FormData = {
  itemName: string;
  quantity: string;
  costPerItem: string;
};

type NestedFormData = {
  productName: string;
};

export default function ItemForm({ item }: ItemFormProps) {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
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

  const { data, error, isLoading } = useQuery<ItemType[]>("products", () =>
    getProducts()
  );

  const createProductMutation = useMutation(
    async (productName: string) => {
      return await createProduct({
        name: productName,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products");
        reset();
      },
    }
  );

  const createItemMutaiton = useMutation(
    async ({ itemName, quantity, costPerItem }: FormData) => {
      return await createItem({
        name: itemName,
        quantity,
        cost: Number(costPerItem),
      });
    },
    {
      onSuccess: async (data) => {
        await Promise.all(
          selectedProducts.map(async (product) => {
            await addItemInProduct({
              id: product,
              itemRef: [
                {
                  _type: "reference",
                  _ref: data._id,
                },
              ],
            });
          })
        );
        router.push(data ? `/items/${data._id}` : "/items");
      },
    }
  );

  const updateItemMutaiton = useMutation(
    async ({ itemName, quantity, costPerItem }: FormData) => {
      return await updateItem({
        id: item?._id as string,
        name: itemName,
        quantity: Number(quantity),
        cost: Number(costPerItem),
      });
    },
    {
      onSuccess: () => {
        router.push("/items");
      },
    }
  );

  const onCreateItem = handleSubmit(async (formData: FormData) => {
    const { itemName, quantity, costPerItem } = formData;

    createItemMutaiton.mutate({
      itemName,
      quantity,
      costPerItem,
    });
  });

  const onUpdateItem = handleSubmit(async (formData: FormData) => {
    const { itemName, quantity, costPerItem } = formData;

    updateItemMutaiton.mutate({
      itemName,
      quantity,
      costPerItem,
    });
  });

  const onAddProduct = nestedSubmit(async (nestedFormData: NestedFormData) => {
    createProductMutation.mutate(nestedFormData.productName);
  });

  const onSelectProducts = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const products = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedProducts(products);
  };

  return (
    <form>
      <div className="flex flex-col max-w-4xl mx-auto p-4">
        <div className="w-full flex justify-between mb-2">
          <Button type="button" onClick={() => router.back()}>
            Go back
          </Button>
          <div>
            {(createItemMutaiton.isIdle || updateItemMutaiton.isIdle) && (
              <Button
                variant="solid"
                colorScheme="twitter"
                type="button"
                onClick={item ? onUpdateItem : onCreateItem}
              >
                {item ? "Update" : "Add"}
              </Button>
            )}
            {(createItemMutaiton.isLoading || updateItemMutaiton.isLoading) && (
              <Button
                variant="solid"
                colorScheme="twitter"
                type="button"
                disabled={
                  createItemMutaiton.isLoading || updateItemMutaiton.isLoading
                }
              >
                {item ? "Updating..." : "Adding..."}
              </Button>
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

        <label className="text-xl font-bold mt-8 mb-4">In Product:</label>
        {/* <RadioGroup sx={{ p: 4 }} onChange={setValue} value={value}>
          <Stack spacing={5} direction="column">
            <>
              <Radio value="1" name="select-products">
                Select existing products:
              </Radio>
              {isLoading && <div>Fetching products...</div>}
              {error && <p>Something is wrong...</p>}
              {data && (
                <Select
                  data-testid="products-select"
                  sx={{ height: "8rem" }}
                  multiple
                  disabled={value !== "1"}
                  className="border-2"
                >
                  {data.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </Select>
              )}
            </>
            <>
              <Radio value="2" name="new-product">
                Create a new product:
              </Radio>
              <FormLabel htmlFor="product-name">Product Name</FormLabel>
              <div className="flex item-center">
                <div className="flex flex-col w-full">
                  <Input
                    id="product-name"
                    type="text"
                    {...nestedRegister("productName", {
                      required: "Please enter a product name",
                      disabled: value !== "2",
                    })}
                    sx={{ py: 1 }}
                  />
                  <p className="text-red-600" role="alert">
                    {nestedErrors.productName &&
                      nestedErrors.productName.message}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={onAddProduct}
                  disabled={!isDirty || !isValid}
                  sx={{ ml: 4 }}
                >
                  Add Product
                </Button>
              </div>
            </>
          </Stack>
        </RadioGroup> */}

        <>
          <label htmlFor="select-existing-products" className="my-2">
            Select existing products:
          </label>
          {(isLoading || createProductMutation.isLoading) && (
            <div>Fetching products...</div>
          )}
          {error && <p>Something is wrong...</p>}
          {data && !createProductMutation.isLoading && (
            <Select
              id="select-existing-products"
              sx={{ height: "8rem" }}
              multiple
              className="border-2"
              onChange={onSelectProducts}
            >
              {data.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </Select>
          )}

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
