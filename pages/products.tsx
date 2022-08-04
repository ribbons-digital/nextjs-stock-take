import ProductComp from "@/components/Product";
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
import { trpc } from "utils/trpc";

const Products: NextPage = () => {
  const router = useRouter();
  const { data, error, isLoading } = trpc.useQuery(["products.products"]);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Something went wrong</p>;

  return (
    <div className="flex flex-col container mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-end mb-6">
        <Button
          type="button"
          variant="solid"
          colorScheme="twitter"
          onClick={() => router.push("/products/new")}
        >
          + Add New Product
        </Button>
      </div>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th sx={{ textAlign: "center" }}>Product</Th>
              <Th sx={{ textAlign: "center" }}>Quantity</Th>
              <Th sx={{ textAlign: "center" }}>Orders</Th>
              <Th sx={{ textAlign: "center" }}>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((product, index) => (
              <ProductComp products={data} index={index} key={product.id} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Products;

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
