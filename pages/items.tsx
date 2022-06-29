import Item from "@/components/Item";
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
import { getItems } from "services/sanity/item";
import { ItemType } from "types";

const Items: NextPage = () => {
  const router = useRouter();
  const { data, error, isLoading } = useQuery<ItemType[]>("items", () =>
    getItems()
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
          onClick={() => router.push("/items/new")}
        >
          + Add New Item
        </Button>
      </div>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Item Name</Th>
              <Th>Quantity</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((item, index) => (
              <Item items={data} index={index} key={item._id} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Items;

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
