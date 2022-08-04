import OrderForm from "@/components/OrderForm";
import { Product } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

type PropTypes = {
  children: React.ReactNode;
};

const Order: NextPage<PropTypes> = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const { data, error, isLoading } = trpc.useQuery(["products.products"]);
  const {
    data: orderData,
    error: orderError,
    isLoading: orderLoading,
  } = trpc.useQuery(["orders.single-order", { orderId: orderId as string }]);
  if (isLoading || orderLoading) return <p>Loading...</p>;
  if (error || orderError || data?.length === 0 || !orderData)
    return <p>Error: Something is wrong...</p>;

  return <OrderForm products={data as Product[]} order={orderData} />;
};

export default Order;
