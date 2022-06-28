import Order from "@/components/Order";
import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { OrderType } from "types";
import { OrdersResType } from "./api/orders";

const Orders: NextPage = () => {
  const router = useRouter();
  const { data, error, isLoading } = useQuery<OrderType[]>(
    "orders",
    async () => {
      const data = await fetch("http://localhost:3000/api/orders");

      if (!data.ok) {
        throw new Error("Something went wrong");
      }

      const json = (await data.json()) as OrdersResType;
      if (json.error) {
        throw new Error(json.error);
      }
      return json.orders;
    }
  );

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Something went wrong</p>;

  return (
    <div className="flex flex-col container mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-end mb-6">
        <Button
          type="button"
          variant="solid"
          colorScheme="twitter"
          onClick={() => router.push("/orders/new")}
        >
          + Add New Order
        </Button>
      </div>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th sx={{ textAlign: "center" }}>Order Number</Th>
              <Th sx={{ textAlign: "center" }}>Ordered Date</Th>
              <Th sx={{ textAlign: "center" }}>Quantity</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((order, index) => (
              <Order orders={data} index={index} key={order._id} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Orders;

export const getServerSideProps = withIronSessionSsr(function ({ req, res }) {
  const { user } = req.session;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}, sessionOptions);
