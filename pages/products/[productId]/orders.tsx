import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import getWeek from "date-fns/getWeek";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getOrdersInProduct } from "services/sanity/product";
import { OrderType } from "types";
import { groupBy } from "utils";

type PropTypes = {
  week: string;
  order: OrderType;
}[];

export default function ProductOrders({ orders }: { orders: PropTypes[] }) {
  const router = useRouter();
  const { productId } = router.query;
  const { data, isLoading, error } = useQuery<PropTypes[]>(
    ["ordersInProductId", productId as string],
    async () => {
      const ordersInProduct = await getOrdersInProduct({
        id: productId as string,
      });

      const weeksArr = ordersInProduct[0].orders.map((order) => {
        getWeek(new Date(order.date));
        return {
          week: String(getWeek(new Date(order.date))),
          order,
        };
      });

      return Object.values(groupBy(weeksArr, (obj) => obj.week));
    }
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: Something is wrong...</p>;

  return (
    <>
      <div className="w-full flex justify-start mt-4 mb-6">
        <Breadcrumb>
          <BreadcrumbItem textColor="blue.500">
            <BreadcrumbLink href="/products">products</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem textColor="blue.500">
            <BreadcrumbLink href={`/products/${productId}`}>
              {productId}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">orders</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {data?.map((weeklyOrders, i) => {
          return (
            <div
              key={i}
              style={{
                marginBottom: "1rem",
              }}
            >
              <h1
                style={{
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                Week {weeklyOrders[0].week}
              </h1>
              <div
                style={{
                  marginBottom: "1rem",
                }}
              >
                {weeklyOrders.length} order(s)
              </div>
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Order Number</Th>
                      <Th>Order Date</Th>
                      <Th sx={{ textAlign: "center" }}>Order Quantity</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {weeklyOrders.map((order, i) => (
                      <Tr key={order.order._id}>
                        <Td>
                          <Link href={`/orders/${order.order._id as string}`}>
                            <div className="underline underline-offset-1 text-blue-700">
                              {order.order.orderNumber}
                            </div>
                          </Link>
                        </Td>
                        <Td>{order.order.date}</Td>
                        <td className="text-center">
                          {order.order.orderedItems.reduce(
                            (prevValue, currItem) =>
                              prevValue + Number(currItem.quantity),
                            0
                          )}
                        </td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          );
        })}
      </div>
    </>
  );
}
