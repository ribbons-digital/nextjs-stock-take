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
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { createOrder, deleteOrder, updateOrder } from "services/sanity/order";
import {
  OrderItemParamsType,
  OrderItemType,
  OrderType,
  ProductType,
} from "types";

type OrderFormProps = {
  products: ProductType[];
  order?: OrderType;
};

type FormData = {
  orderNumber: string;
  itemList: OrderItemParamsType[];
  orderDate: string;
};

export default function OrderForm({ products, order }: OrderFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // State
  const [orderItems, setOrderItems] = React.useState<OrderItemType[]>(
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
      (product) => product._id === selectedProductId
    );

    const newOrderItem = {
      orderedItem: {
        _id: `${orderedItem?._id}.${Date.now()}`,
        name: orderedItem?.name,
      },
      quantity: Number(selectedProductQuantity),
      note,
    } as OrderItemType;

    setOrderItems([...orderItems, newOrderItem]);

    clearModalFields();
    onClose();
  };

  const createOrderMutaiton = useMutation(
    async ({ orderNumber, itemList, orderDate }: FormData) => {
      return await createOrder({
        orderedItems: itemList,
        orderNumber,
        date: orderDate,
      });
    },
    {
      onSuccess: (data) => {
        router.push(data ? `/orders/${data._id}` : "/orders");
      },
    }
  );

  const updateOrderMutaiton = useMutation(
    async ({ itemList }: FormData) => {
      return await updateOrder({
        orderId: order?._id as string,
        orderedItems: itemList,
        orderNumber: order?.orderNumber as string,
        date: order?.date as string,
      });
    },
    {
      onSuccess: () => {
        router.push("/orders");
      },
    }
  );

  const deleteOrderMutaiton = useMutation(
    async ({ id }: { id: string }) => {
      return await deleteOrder({ id });
    },
    {
      onSuccess: () => {
        router.push("/orders");
      },
    }
  );

  const onCreateOrder = handleSubmit(async (formData: FormData) => {
    const { orderDate, orderNumber } = formData;
    const itemList = orderItems.map((item) => {
      return {
        orderedItem: {
          _type: "reference",
          _ref: item.orderedItem._id?.split(".")[0],
        },
        quantity: item.quantity,
      };
    }) as OrderItemParamsType[];

    createOrderMutaiton.mutate({
      orderNumber,
      orderDate,
      itemList,
    });
  });

  const onUpdateOrder = handleSubmit(async (formData: FormData) => {
    const itemList = orderItems.map((item) => {
      return {
        orderedItem: {
          _type: "reference",
          _ref: item.orderedItem._id?.split(".")[0],
        },
        quantity: item.quantity,
      };
    }) as OrderItemParamsType[];

    updateOrderMutaiton.mutate({
      orderNumber: order?.orderNumber as string,
      itemList,
      orderDate: order?.date as string,
    });
  });

  const onDeleteOrder = () => {
    deleteOrderMutaiton.mutate({ id: order?._id as string });
  };

  return (
    <form>
      <div className="flex flex-col max-w-4xl mx-auto p-4">
        <div className="w-full flex justify-between mb-2">
          <Button type="button" onClick={() => router.back()}>
            Go back
          </Button>
          <div>
            {(createOrderMutaiton.isIdle || updateOrderMutaiton.isIdle) && (
              <Button
                variant="solid"
                colorScheme="twitter"
                type="button"
                onClick={order ? onUpdateOrder : onCreateOrder}
              >
                {order ? "Update" : "Add"}
              </Button>
            )}
            {(createOrderMutaiton.isLoading ||
              updateOrderMutaiton.isLoading) && (
              <Button
                variant="solid"
                colorScheme="twitter"
                type="button"
                disabled={
                  createOrderMutaiton.isLoading || updateOrderMutaiton.isLoading
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
                  <option value={product._id} key={product._id}>
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
              </Tr>
            </Thead>
            <Tbody>
              {orderItems.map((item, i) => (
                <Tr key={item.orderedItem._id + i}>
                  <Td>{item.orderedItem.name}</Td>
                  <Td>{item.quantity}</Td>
                  <td role="gridcell">{item.note}</td>
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
          defaultValue={order ? order.date : ""}
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
