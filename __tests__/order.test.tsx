import OrderForm from "@/components/OrderForm";
import { userEvent } from "@storybook/testing-library";
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { mockOrder3, products } from "mocks/db";
import { useRouter } from "next/router";
import NewOrder from "pages/orders/new";
import Order from "pages/orders/[orderId]";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  createOrder,
  deleteOrder,
  getOrder,
  updateOrder,
} from "services/sanity/order";
import { getProducts } from "services/sanity/product";
import { ProductType } from "types";
import "whatwg-fetch";
import { server } from "../mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

jest.mock("@sanity/client", () => {
  return function sanity() {
    return {
      fetch: () => ({
        methodOne: [{}],
        methodTwo: [{}],
      }),
    };
  };
});

jest.mock("../services/sanity/product");
jest.mock("../services/sanity/order");
const mockGetOrder = getOrder as jest.MockedFunction<typeof getOrder>;
const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;
const mockCreateOrder = createOrder as jest.MockedFunction<typeof createOrder>;
const mockUpdateOrder = updateOrder as jest.MockedFunction<typeof updateOrder>;
const mockDeleteOrder = deleteOrder as jest.MockedFunction<typeof deleteOrder>;

const mockedUseRouterReturnValue = {
  query: {},
  pathname: "/",
  asPath: "/",
  events: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
  push: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
  reload: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  back: jest.fn(() => Promise.resolve(true)),
};

jest.mock("next/router", () => ({
  useRouter: () => mockedUseRouterReturnValue,
}));

describe("Order page", () => {
  test("it should render the form correctly - New Order Form", async () => {
    mockGetProducts.mockResolvedValueOnce(products);
    // arrange
    const queryClient = new QueryClient();
    const router = useRouter();

    // arrange - render UI
    const { container, rerender } = render(
      <QueryClientProvider client={queryClient}>
        <NewOrder>
          <OrderForm products={products as ProductType[]} />
        </NewOrder>
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    const backBtn = await screen.findByRole("button", { name: /go back/i });
    const addBtn = await screen.findByRole("button", { name: "Add" });
    const orderNumberInput = await screen.findByLabelText(/order number/i);
    const addItemBtn = await screen.findByRole("button", { name: /add item/i });
    const dateInput = await screen.findByLabelText(/order date/i);
    screen.getByText(/item list/i);
    screen.getByRole("columnheader", { name: /product name/i });
    screen.getByRole("columnheader", { name: /quantity/i });
    screen.getByRole("columnheader", { name: /note/i });

    expect(screen.getAllByRole("row").length).toBe(1);

    // act - click on back btn
    userEvent.click(backBtn);
    expect(router.back).toBeCalledTimes(1);

    // act - click on add btn
    userEvent.click(addBtn);

    rerender(
      <QueryClientProvider client={queryClient}>
        <NewOrder>
          <OrderForm products={products as ProductType[]} />
        </NewOrder>
      </QueryClientProvider>
    );
    // assert - add without filling out the form - error msg
    expect(mockCreateOrder).toBeCalledTimes(0);
    expect((await screen.findAllByText(/field can't be empty/i)).length).toBe(
      2
    );

    expect(mockGetProducts).toBeCalledTimes(1);

    // snapshot
    expect(container.firstChild).toMatchInlineSnapshot(`
      .emotion-0 {
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        appearance: none;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        position: relative;
        white-space: nowrap;
        vertical-align: middle;
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      .emotion-2 {
        display: block;
        text-align: start;
      }

      .emotion-3 {
        padding-top: 1px;
        padding-bottom: 1px;
        width: 100%;
      }

      .emotion-5 {
        border: 0;
        border-bottom-width: 1px;
        width: 100%;
      }

      .emotion-6 {
        display: block;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        overflow-x: auto;
        overflow-y: hidden;
        max-width: 100%;
      }

      <form>
        <div
          class="flex flex-col max-w-4xl mx-auto p-4"
        >
          <div
            class="w-full flex justify-between mb-2"
          >
            <button
              class="chakra-button emotion-0"
              type="button"
            >
              Go back
            </button>
            <div>
              <button
                class="chakra-button emotion-0"
                type="button"
              >
                Add
              </button>
            </div>
          </div>
          <label
            class="chakra-form__label emotion-2"
            for="order-number"
          >
            Order Number
          </label>
          <input
            aria-describedby="order-number-error"
            class="chakra-input emotion-3"
            id="order-number"
            name="orderNumber"
            type="number"
            value=""
          />
          <p
            class="text-red-600"
            id="order-number-error"
            role="alert"
          >
            The field can't be empty
          </p>
          <div
            class="flex justify-between items-center w-full"
          >
            <div
              class="flex w-full items-center justify-between"
            >
              <div
                class="text-xl font-bold"
              >
                Item List:
              </div>
              <button
                class="chakra-button my-6 emotion-0"
                type="button"
              >
                + Add Item
              </button>
            </div>
          </div>
          <hr
            aria-orientation="horizontal"
            class="chakra-divider emotion-5"
          />
          <div
            class="chakra-table__container emotion-6"
          >
            <table
              class="chakra-table emotion-7"
              role="table"
            >
              <thead
                class="emotion-7"
              >
                <tr
                  class="emotion-7"
                  role="row"
                >
                  <th
                    class="emotion-7"
                  >
                    Product Name
                  </th>
                  <th
                    class="emotion-7"
                  >
                    Quantity
                  </th>
                  <th
                    class="emotion-7"
                  >
                    Note
                  </th>
                </tr>
              </thead>
              <tbody
                class="emotion-7"
              />
            </table>
          </div>
          <label
            class="text-xl font-bold mt-8"
            for="orderDate"
          >
            Order Date:
          </label>
          <input
            aria-describedby="order-date-error"
            class="chakra-input border-2 emotion-7"
            id="orderDate"
            name="orderDate"
            type="date"
            value=""
          />
          <p
            class="text-red-600"
            id="order-date-error"
            role="alert"
          >
            The field can't be empty
          </p>
        </div>
      </form>
    `);
  });

  test("it should function correctly - New Order Form", async () => {
    mockGetProducts.mockResolvedValueOnce(products);
    // @ts-ignore
    mockCreateOrder.mockResolvedValueOnce();
    // arrange
    const queryClient = new QueryClient();
    const router = useRouter();

    // arrange - render UI
    const { container, rerender, debug } = render(
      <QueryClientProvider client={queryClient}>
        <NewOrder>
          <OrderForm products={products as ProductType[]} />
        </NewOrder>
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    const backBtn = await screen.findByRole("button", { name: /go back/i });
    const addBtn = await screen.findByRole("button", { name: "Add" });
    const orderNumberInput = await screen.findByLabelText(/order number/i);
    const addItemBtn = await screen.findByRole("button", { name: /add item/i });
    const dateInput = await screen.findByLabelText(/order date/i);

    userEvent.type(orderNumberInput, "1122");
    expect(orderNumberInput).toHaveValue(1122);

    userEvent.type(dateInput, "2022-06-27");

    expect(dateInput).toHaveValue("2022-06-27");

    userEvent.click(addItemBtn);

    await screen.findByText(/order item/i);

    await screen.findByText(/Select a product from/i);
    const productSelect = await screen.findByLabelText(/product/i);
    const quantityInput = await screen.findByLabelText(/quantity/i);
    const noteTextArea = await screen.findByLabelText(/note/i);

    const modalCancelBtn = await screen.findByRole("button", {
      name: /cancel/i,
    });
    const modalAddBtn = await screen.findByRole("button", { name: /add/i });

    userEvent.click(modalCancelBtn);
    expect(productSelect).not.toBeVisible();
    userEvent.click(addItemBtn);
    userEvent.selectOptions(productSelect, products[1].name);
    userEvent.type(quantityInput, "1");
    userEvent.type(noteTextArea, "this is a note");

    expect(productSelect).toHaveValue(products[1]._id);
    expect(quantityInput).toHaveValue(1);
    expect(noteTextArea).toHaveValue("this is a note");

    userEvent.click(modalAddBtn);

    expect(quantityInput).not.toBeVisible();
    expect(screen.getAllByRole("row").length).toBe(2);
    screen.getByRole("gridcell", { name: products[1].name });
    screen.getByRole("gridcell", { name: /1/i });
    screen.getByRole("gridcell", { name: /this is a note/i });

    await act(async () => userEvent.click(addBtn));

    const itemList = [
      {
        orderedItem: {
          _type: "reference",
          _ref: products[1]._id,
        },
        quantity: 1,
      },
    ];
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith("/orders");
      expect(mockCreateOrder).toBeCalledTimes(1);
      expect(mockCreateOrder).toBeCalledWith({
        orderedItems: itemList,
        orderNumber: "1122",
        date: "2022-06-27",
      });
    });
  });

  test("it should funciton correctly - Edit Order Form", async () => {
    // arrange
    const queryClient = new QueryClient();
    const router = useRouter();

    mockGetProducts.mockResolvedValueOnce(products);
    // @ts-ignore
    mockUpdateOrder.mockResolvedValueOnce();
    mockGetOrder.mockResolvedValueOnce([mockOrder3]);
    // @ts-ignore
    mockDeleteOrder.mockResolvedValueOnce();

    // arrange - render UI
    render(
      <QueryClientProvider client={queryClient}>
        <Order>
          <OrderForm products={products as ProductType[]} order={mockOrder3} />
        </Order>
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    const backBtn = await screen.findByRole("button", { name: /go back/i });
    const updateBtn = await screen.findByRole("button", { name: /update/i });
    const deleteBtn = await screen.findByRole("button", { name: /delete/i });
    const orderNumberInput = await screen.findByLabelText(/order number/i);
    const addItemBtn = await screen.findByRole("button", { name: /add item/i });
    const dateInput = await screen.findByLabelText(/order date/i);

    expect(orderNumberInput).toHaveValue(1212);
    expect(orderNumberInput).toBeDisabled();
    expect(dateInput).toHaveValue("2022-05-29");
    expect(dateInput).toBeDisabled();
    userEvent.type(orderNumberInput, "1122");
    userEvent.type(dateInput, "2022-06-27");
    expect(screen.getAllByRole("row").length).toBe(
      mockOrder3.orderedItems.length + 1
    );

    screen.getAllByRole("gridcell", { name: products[3].name });
    screen.getByRole("gridcell", { name: /2/i });
    screen.getByRole("gridcell", { name: /-1/i });
    screen.getByRole("gridcell", { name: /customer returned one unit/i });

    userEvent.click(addItemBtn);

    const modalAddBtn = await screen.findByRole("button", {
      name: /add/i,
    });
    expect(modalAddBtn).toBeDisabled();
    await screen.findByText(/order item/i);

    await screen.findByText(/Select a product from/i);
    const productSelect = await screen.findByLabelText(/product/i);
    const quantityInput = await screen.findByLabelText(/quantity/i);
    const noteTextArea = await screen.findByLabelText(/note/i);

    const modalCancelBtn = await screen.findByRole("button", {
      name: /cancel/i,
    });

    userEvent.click(modalCancelBtn);
    expect(productSelect).not.toBeVisible();
    userEvent.click(addItemBtn);
    userEvent.selectOptions(productSelect, products[1].name);
    userEvent.type(quantityInput, "1");
    userEvent.type(noteTextArea, "this is a note");

    expect(productSelect).toHaveValue(products[1]._id);
    expect(quantityInput).toHaveValue(1);
    expect(noteTextArea).toHaveValue("this is a note");

    userEvent.click(modalAddBtn);
    expect(screen.getAllByRole("row").length).toBe(
      mockOrder3.orderedItems.length + 2
    );

    expect(quantityInput).not.toBeVisible();
    screen.getByRole("gridcell", { name: products[1].name });
    screen.getByRole("gridcell", { name: "1" });
    screen.getByRole("gridcell", { name: /this is a note/i });

    await act(async () => userEvent.click(updateBtn));

    const existingItems = mockOrder3.orderedItems.map((item) => ({
      orderedItem: {
        _type: "reference",
        _ref: item.orderedItem._id,
      },
      quantity: item.quantity,
    }));

    const itemList = [
      ...existingItems,
      {
        orderedItem: {
          _type: "reference",
          _ref: products[1]._id,
        },
        quantity: 1,
      },
    ];
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith("/orders");
      expect(mockUpdateOrder).toBeCalledTimes(1);
      expect(mockUpdateOrder).toBeCalledWith({
        orderId: mockOrder3?._id as string,
        orderedItems: itemList,
        orderNumber: mockOrder3.orderNumber,
        date: mockOrder3.date,
      });
    });

    await act(async () => userEvent.click(deleteBtn));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(2);
      expect(router.push).toHaveBeenCalledWith("/orders");
      expect(mockDeleteOrder).toBeCalledTimes(1);
      expect(mockDeleteOrder).toBeCalledWith({
        id: mockOrder3?._id as string,
      });
    });
  });
});
