import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Order, OrderedItem, Product } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { trpc } from "utils/trpc";

type OrderFormProps = {
  products: Product[];
  order?: Order & {
    orderedItems: OrderedItem[];
  };
};

type FormData = {
  orderNumber: string;
  // itemList: OrderedItem[];
  orderDate: string;
};

export default function OrderForm({ products, order }: OrderFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const queryClient = useQueryClient();

  // State
  const [orderItems, setOrderItems] = React.useState<OrderedItem[]>(
    order?.orderedItems ?? []
  );
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");
  const [selectedProductQuantity, setSelectedProductQuantity] =
    React.useState<string>("");
  const [note, setNote] = React.useState<string>("");

  const router = useRouter();

  // Helper functions
  const clearModalFields = () => {
    setSelectedProductId("");
    setSelectedProductQuantity("");
    setNote("");
  };

  const handleSelectProduct = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(event.target.value);
  };

  const handleAddOrderItem = () => {
    const orderedItem = products.find(
      (product) => product.id === selectedProductId
    );

    const newOrderItem = {
      productId: orderedItem?.id,
      quantity: Number(selectedProductQuantity),
      note,
    } as OrderedItem;

    setOrderItems([...orderItems, newOrderItem]);

    clearModalFields();
    onClose();
  };

  const createOrderMutation = trpc.useMutation(["orders.create-order"], {
    onSuccess: (data) => {
      router.push(data ? `/orders/${data.id}` : "/orders");
    },
  });

  // const createOrderMutaiton = useMutation(
  //   async ({ orderNumber, itemList, orderDate }: FormData) => {
  //     return await createOrder({
  //       orderedItems: itemList,
  //       orderNumber,
  //       date: orderDate,
  //     });
  //   },
  //   {
  //     onSuccess: (data) => {
  //       router.push(data ? `/orders/${data._id}` : "/orders");
  //     },
  //   }
  // );

  const updateOrderMutaiton = trpc.useMutation(["orders.update-order"], {
    onSuccess: () => {
      router.push("/orders");
    },
  });

  const deleteOrderMutation = trpc.useMutation(["orders.delete-order"], {
    onSuccess: () => {
      router.push("/orders");
    },
  });

  const onCreateOrder = handleSubmit(async (formData: FormData) => {
    const { orderDate, orderNumber } = formData;
    const itemList = orderItems
      .filter((item) => !order?.orderedItems.includes(item))
      .map((item) => {
        return {
          productId: item.productId,
          quantity: item.quantity,
          note: item.note ?? "",
        };
      });

    createOrderMutation.mutate({
      orderNumber,
      date: new Date(orderDate),
      orderedProducts: itemList,
    });
  });

  const onUpdateOrder = handleSubmit(async () => {
    const orderedItems = orderItems
      .filter((item) => !order?.orderedItems.includes(item))
      .map((item) => {
        return {
          productId: item.productId,
          quantity: item.quantity,
          note: item.note ?? "",
        };
      });

    updateOrderMutaiton.mutate({
      id: order?.id as string,
      orderNumber: order?.orderNumber as string,
      orderedProducts: orderedItems,
      date: new Date(order?.date as Date),
    });
  });

  const onDeleteOrder = () => {
    deleteOrderMutation.mutate({ orderId: order?.id as string });
  };

  const deleteProductFromOrderMutation = trpc.useMutation(
    ["orders.remove-product-from-order"],
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders.single-order"]);
      },
    }
  );

  const onDeleteProductFromOrder = (productId: string) => {
    if (order && order.orderedItems.find((item) => item.id === productId)) {
      deleteProductFromOrderMutation.mutate({
        id: order.id,
        productId,
      });
    } else {
      setOrderItems(orderItems.filter((item) => item.id !== productId));
    }
  };

  return (
    <form>
      <div className="flex flex-col max-w-4xl mx-auto p-4">
        <div className="w-full flex justify-between mb-2">
          <Button type="button" onClick={() => router.back()}>
            Go back
          </Button>
          <div>
            {(createOrderMutation.isIdle || updateOrderMutaiton.isIdle) && (
              <Button
                variant="solid"
                colorScheme="twitter"
                type="button"
                onClick={order ? onUpdateOrder : onCreateOrder}
              >
                {order ? "Update" : "Add"}
              </Button>
            )}
            {(createOrderMutation.isLoading ||
              updateOrderMutaiton.isLoading) && (
              <Button
                variant="solid"
                colorScheme="twitter"
                type="button"
                disabled={
                  createOrderMutation.isLoading || updateOrderMutaiton.isLoading
                }
              >
                {order ? "Updating..." : "Adding..."}
              </Button>
            )}
            {order && (
              <Button
                className="ml-2"
                variant="solid"
                colorScheme="red"
                type="button"
                name="delete"
                onClick={onDeleteOrder}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
        <FormLabel htmlFor="order-number">Order Number</FormLabel>
        <Input
          id="order-number"
          type="number"
          sx={{ py: 1, width: "100%" }}
          {...register("orderNumber", {
            required: Boolean(order) ? undefined : "The field can't be empty",
            disabled: Boolean(order),
          })}
          defaultValue={order?.orderNumber}
          aria-invalid={Boolean(errors.orderNumber) || undefined}
          aria-describedby={
            errors.orderNumber ? "order-number-error" : undefined
          }
        />
        {errors.orderNumber ? (
          <p className="text-red-600" role="alert" id="order-number-error">
            {errors.orderNumber.message}
          </p>
        ) : null}

        <Modal
          isOpen={isOpen}
          onClose={onClose}
          aria-labelledby="Add-order-item-modal"
          aria-describedby="A-modal-that-allows-you-to-add-order-items"
        >
          <ModalOverlay />
          <ModalContent className="p-4">
            <ModalCloseButton />
            <ModalHeader id="Add-order-item-modal">Order Item</ModalHeader>
            <Text
              id="A-modal-that-allows-you-to-add-order-items"
              sx={{ my: 2 }}
            >
              Select a product from the list and set the quantity you want to
              add to this order
            </Text>
            <FormControl sx={{ py: 2, width: "100%" }}>
              <FormLabel htmlFor="product-label">Product</FormLabel>
              <Select
                id="product-label"
                // value={selectedProductId}
                onChange={handleSelectProduct}
              >
                {products.map((product, i) => (
                  <option value={product.id} key={product.id}>
                    {product.name}
                  </option>
                ))}
              </Select>

              <FormLabel htmlFor="quantity" className="pt-2">
                Quantity
              </FormLabel>
              <Input
                id="quantity"
                type="number"
                value={selectedProductQuantity}
                onChange={(event) =>
                  setSelectedProductQuantity(String(event.target.value))
                }
                sx={{ py: 1, width: "100%" }}
              />
              <FormLabel htmlFor="note" className="pt-2">
                Note
              </FormLabel>
              <Textarea
                id="note"
                rows={4}
                placeholder="(Optional)"
                value={note}
                onChange={(event) => setNote(String(event.target.value))}
                sx={{ py: 1, width: "100%" }}
              />
            </FormControl>
            <div className="w-full flex items-center justify-end">
              <Button sx={{ mr: 2 }} variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddOrderItem}
                disabled={
                  !selectedProductId ||
                  !selectedProductQuantity ||
                  selectedProductQuantity === "0"
                }
              >
                Add
              </Button>
            </div>
          </ModalContent>
        </Modal>

        <div className="flex justify-between items-center w-full">
          <div className="flex w-full items-center justify-between">
            <div className="text-xl font-bold">Item List:</div>

            <Button className="my-6" variant="contained" onClick={onOpen}>
              + Add Item
            </Button>
          </div>
        </div>
        <Divider />

        <TableContainer>
          <Table>
            {updateOrderMutaiton.isLoading && (
              <TableCaption>Adding item...</TableCaption>
            )}
            <Thead>
              <Tr>
                <Th>Product Name</Th>
                <Th>Quantity</Th>
                <Th>Note</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderItems.map((item, i) => (
                <Tr key={item.productId + i}>
                  <Td>
                    {
                      products[
                        products.findIndex(
                          (p) => (p.id as string) === item.productId
                        )
                      ].name
                    }
                  </Td>
                  <Td>{item.quantity}</Td>
                  <td role="gridcell">{item.note}</td>
                  <td role="gridcell">
                    <Button
                      variant="contained"
                      color="red"
                      onClick={() => onDeleteProductFromOrder(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <label htmlFor="orderDate" className="text-xl font-bold mt-8">
          Order Date:
        </label>
        <Input
          type="date"
          id="orderDate"
          {...register("orderDate", {
            required: Boolean(order) ? undefined : "The field can't be empty",
            disabled: Boolean(order),
          })}
          defaultValue={order ? format(order.date, "yyyy-MM-dd") : ""}
          className="border-2"
          aria-invalid={Boolean(errors.orderDate) || undefined}
          aria-describedby={errors.orderDate ? "order-date-error" : undefined}
        />
        {errors.orderDate ? (
          <p className="text-red-600" role="alert" id="order-date-error">
            {errors.orderDate.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
