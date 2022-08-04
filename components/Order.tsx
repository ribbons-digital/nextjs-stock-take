import { Td, Tr } from "@chakra-ui/react";
import { Order, OrderedItem } from "@prisma/client";
import { useRouter } from "next/router";

export default function OrderComp({
  orders,
  index,
}: {
  orders: (Order & {
    orderedItems: OrderedItem[];
  })[];
  index: number;
}) {
  const order = orders[index];
  const router = useRouter();

  return (
    <Tr key={order.id}>
      <Td>
        <button
          type="button"
          name={order.orderNumber}
          className="underline underline-offset-1 text-blue-700"
          onClick={() => router.push(`/orders/${order.id}`)}
        >
          {order.orderNumber}
        </button>
      </Td>

      <td>{order.date.toDateString()}</td>
      <td>{order.orderedItems.length}</td>
    </Tr>
  );
}
