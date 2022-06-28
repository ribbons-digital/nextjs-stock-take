import OrderForm from "@/components/OrderForm";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getOrder } from "services/sanity/order";
import { getProducts } from "services/sanity/product";
import { OrderType, ProductType } from "types";

type PropTypes = {
  children: React.ReactNode;
};

const Order: NextPage<PropTypes> = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const { data, error, isLoading } = useQuery<ProductType[]>(["products"], () =>
    getProducts()
  );
  const {
    data: orderData,
    error: orderError,
    isLoading: orderLoading,
  } = useQuery<OrderType[]>(["order", orderId], () =>
    getOrder({ id: orderId as string })
  );
  if (isLoading || orderLoading) return <p>Loading...</p>;
  if (error || orderError || data?.length === 0 || orderData?.length === 0)
    return <p>Error: Something is wrong...</p>;

  return <OrderForm products={data as ProductType[]} order={orderData![0]} />;
};

export default Order;
