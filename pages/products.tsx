import Product from "@/components/Product";
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
import Link from "next/link";
import { getProducts } from "services/sanity/product";
import { ProductType } from "types";

type PropTypes = {
  products: ProductType[];
};

const Products: NextPage<PropTypes> = ({ products }) => {
  return (
    <div className="flex flex-col container mx-auto max-w-4xl p-4">
      <div className="w-full flex justify-end mb-6">
        <Link href="/products/new">
          <Button type="button" variant="solid" colorScheme="twitter">
            + Add New Product
          </Button>
        </Link>
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
            {products.map((product, index) => (
              <Product products={products} index={index} key={product._id} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Products;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const { user } = req.session;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  ('*[_type == "product"]{ _id, name, orders, items[]->{_id, quantity} }');

  return {
    props: {
      products: await getProducts(),
    },
  };
},
sessionOptions);
