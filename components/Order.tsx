import { Td, Tr } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { OrderType } from "types";

export default function Order({
  orders,
  index,
}: {
  orders: OrderType[];
  index: number;
}) {
  const order = orders[index];
  const router = useRouter();

  return (
    <Tr key={order._id}>
      <Td>
        <button
          type="button"
          name={order.orderNumber}
          className="underline underline-offset-1 text-blue-700"
          onClick={() => router.push(`/orders/${order._id}`)}
        >
          {order.orderNumber}
        </button>
      </Td>

      <td>{order.date}</td>
      <td>{order.orderedItems.length}</td>
    </Tr>
  );
}
