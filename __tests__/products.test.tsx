import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { products } from "mocks/db";
import { useRouter } from "next/router";
import Products from "pages/products";
import { QueryClient, QueryClientProvider } from "react-query";
import "whatwg-fetch";
import { server } from "../mocks/server";
import { updateProductItemsQuantity } from "../services/sanity/product";

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterAll(() => server.close());
// beforeEach(() => jest.resetAllMocks());
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
const mockedUpdateQuantity = updateProductItemsQuantity as jest.MockedFunction<
  typeof updateProductItemsQuantity
>;

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

describe("Products", () => {
  test("it should render loading", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Products />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  test("it should update product quantity correctly", async () => {
    mockedUpdateQuantity.mockResolvedValueOnce({
      //@ts-ignore
      transactionId: "HePqRSIKIpzDxf9dhzetAb",
      results: [
        {
          id: "20f8a7fe-7944-4652-8bca-407973e1536e",
          document: {
            _createdAt: "2022-05-25T03:55:34Z",
            _id: "20f8a7fe-7944-4652-8bca-407973e1536e",
            _rev: "HePqRSIKIpzDxf9dhzetAb",
            _type: "item",
            _updatedAt: "2022-06-22T05:01:19Z",
            name: "Omnia Oven Bag",
            quantity: 2,
          },
          operation: "update",
        },
      ],
    });
    const queryClient = new QueryClient();
    const { container, rerender } = render(
      <QueryClientProvider client={queryClient}>
        <Products />
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));
    const quantityInput = await screen.findByTestId(
      `quantity-input-${products[0].name}`
    );
    const quantityUpdatebutton = await screen.findByTestId(
      `update-quantity-${products[0].name}`
    );

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "2");
    await userEvent.click(quantityUpdatebutton);

    await waitFor(() => {
      expect(mockedUpdateQuantity).toHaveBeenCalledTimes(1);
      expect(mockedUpdateQuantity).toHaveBeenCalledWith(products[0]._id, 2);
      expect(quantityInput).toHaveValue(2);
    });
  });

  test("it should go to the product page when clicking on product name", async () => {
    const router = useRouter();
    const queryClient = new QueryClient();
    const { container, rerender } = render(
      <QueryClientProvider client={queryClient}>
        <Products />
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    const product = await screen.findByRole("button", {
      name: products[0].name,
    });
    await userEvent.click(product);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toBeCalledWith(`/products/${products[0]._id}`);
    });
  });

  test("it should go to the new product page when clicking on Add New Product button", async () => {
    const router = useRouter();
    const queryClient = new QueryClient();
    const { debug } = render(
      <QueryClientProvider client={queryClient}>
        <Products />
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    const addNewProductBtn = await screen.findByRole("button", {
      name: /add new product/i,
    });
    await userEvent.click(addNewProductBtn);
    // await act(async () => userEvent.click(addNewProductBtn));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toBeCalledWith(`/products/new`);
    });
  });

  test("it should render products", async () => {
    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Products />
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));
    screen.findByRole("button", { name: /update/i });
    screen.findByRole("button", { name: /orders/i });
    screen.findByRole("button", { name: /omnia/i });
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

      .emotion-1 {
        display: block;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        overflow-x: auto;
        overflow-y: hidden;
        max-width: 100%;
      }

      .emotion-5 {
        text-align: center;
      }

      <div
        class="flex flex-col container mx-auto max-w-4xl p-4"
      >
        <div
          class="w-full flex justify-end mb-6"
        >
          <button
            class="chakra-button emotion-0"
            type="button"
          >
            + Add New Product
          </button>
        </div>
        <div
          class="chakra-table__container emotion-1"
        >
          <table
            class="chakra-table emotion-2"
            role="table"
          >
            <thead
              class="emotion-2"
            >
              <tr
                class="emotion-2"
                role="row"
              >
                <th
                  class="emotion-5"
                >
                  Product
                </th>
                <th
                  class="emotion-5"
                >
                  Quantity
                </th>
                <th
                  class="emotion-5"
                >
                  Orders
                </th>
                <th
                  class="emotion-5"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody
              class="emotion-2"
            >
              <tr
                class="emotion-2"
                role="row"
              >
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <button
                    class="underline underline-offset-1 text-blue-700"
                    name="Omnia Oven"
                    type="button"
                  >
                    Omnia Oven
                  </button>
                </td>
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <label
                    for="quantity-input-Omnia Oven"
                  />
                  <input
                    class="chakra-input emotion-2"
                    data-testid="quantity-input-Omnia Oven"
                    id="quantity-input-Omnia Oven"
                    name="quantity-input-Omnia Oven"
                    type="number"
                    value="265"
                  />
                </td>
                <td>
                  <button
                    class="w-full"
                    disabled=""
                  >
                    0
                  </button>
                </td>
                <td>
                  <button
                    class="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center w-full"
                    data-testid="update-quantity-Omnia Oven"
                    type="button"
                  >
                    Update
                  </button>
                </td>
              </tr>
              <tr
                class="emotion-2"
                role="row"
              >
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <button
                    class="underline underline-offset-1 text-blue-700"
                    name="Omnia Thermometer"
                    type="button"
                  >
                    Omnia Thermometer
                  </button>
                </td>
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <label
                    for="quantity-input-Omnia Thermometer"
                  />
                  <input
                    class="chakra-input emotion-2"
                    data-testid="quantity-input-Omnia Thermometer"
                    id="quantity-input-Omnia Thermometer"
                    name="quantity-input-Omnia Thermometer"
                    type="number"
                    value="71"
                  />
                </td>
                <td>
                  <button
                    class="w-full"
                    disabled=""
                  >
                    0
                  </button>
                </td>
                <td>
                  <button
                    class="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center w-full"
                    data-testid="update-quantity-Omnia Thermometer"
                    type="button"
                  >
                    Update
                  </button>
                </td>
              </tr>
              <tr
                class="emotion-2"
                role="row"
              >
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <button
                    class="underline underline-offset-1 text-blue-700"
                    name="Omnia Potholder"
                    type="button"
                  >
                    Omnia Potholder
                  </button>
                </td>
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <label
                    for="quantity-input-Omnia Potholder"
                  />
                  <input
                    class="chakra-input emotion-2"
                    data-testid="quantity-input-Omnia Potholder"
                    id="quantity-input-Omnia Potholder"
                    name="quantity-input-Omnia Potholder"
                    type="number"
                    value="30"
                  />
                </td>
                <td>
                  <button
                    class="underline underline-offset-1 text-blue-700 w-full"
                    name="orders"
                    type="button"
                  >
                    4
                  </button>
                </td>
                <td>
                  <button
                    class="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center w-full"
                    data-testid="update-quantity-Omnia Potholder"
                    type="button"
                  >
                    Update
                  </button>
                </td>
              </tr>
              <tr
                class="emotion-2"
                role="row"
              >
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <button
                    class="underline underline-offset-1 text-blue-700"
                    name="Omnia Mega Kit"
                    type="button"
                  >
                    Omnia Mega Kit
                  </button>
                </td>
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <label
                    for="quantity-input-Omnia Mega Kit"
                  />
                  <input
                    class="chakra-input emotion-2"
                    data-testid="quantity-input-Omnia Mega Kit"
                    disabled=""
                    id="quantity-input-Omnia Mega Kit"
                    name="quantity-input-Omnia Mega Kit"
                    type="number"
                    value="0"
                  />
                </td>
                <td>
                  <button
                    class="underline underline-offset-1 text-blue-700 w-full"
                    name="orders"
                    type="button"
                  >
                    1
                  </button>
                </td>
                <td />
              </tr>
              <tr
                class="emotion-2"
                role="row"
              >
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <button
                    class="underline underline-offset-1 text-blue-700"
                    name="Omnia Silicone Mould"
                    type="button"
                  >
                    Omnia Silicone Mould
                  </button>
                </td>
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <label
                    for="quantity-input-Omnia Silicone Mould"
                  />
                  <input
                    class="chakra-input emotion-2"
                    data-testid="quantity-input-Omnia Silicone Mould"
                    id="quantity-input-Omnia Silicone Mould"
                    name="quantity-input-Omnia Silicone Mould"
                    type="number"
                    value="65"
                  />
                </td>
                <td>
                  <button
                    class="w-full"
                    disabled=""
                  >
                    0
                  </button>
                </td>
                <td>
                  <button
                    class="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center w-full"
                    data-testid="update-quantity-Omnia Silicone Mould"
                    type="button"
                  >
                    Update
                  </button>
                </td>
              </tr>
              <tr
                class="emotion-2"
                role="row"
              >
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <button
                    class="underline underline-offset-1 text-blue-700"
                    name="Omnia Recipe Book"
                    type="button"
                  >
                    Omnia Recipe Book
                  </button>
                </td>
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <label
                    for="quantity-input-Omnia Recipe Book"
                  />
                  <input
                    class="chakra-input emotion-2"
                    data-testid="quantity-input-Omnia Recipe Book"
                    id="quantity-input-Omnia Recipe Book"
                    name="quantity-input-Omnia Recipe Book"
                    type="number"
                    value="12"
                  />
                </td>
                <td>
                  <button
                    class="w-full"
                    disabled=""
                  >
                    0
                  </button>
                </td>
                <td>
                  <button
                    class="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center w-full"
                    data-testid="update-quantity-Omnia Recipe Book"
                    type="button"
                  >
                    Update
                  </button>
                </td>
              </tr>
              <tr
                class="emotion-2"
                role="row"
              >
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <button
                    class="underline underline-offset-1 text-blue-700"
                    name="Omnia Muffin Ring"
                    type="button"
                  >
                    Omnia Muffin Ring
                  </button>
                </td>
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <label
                    for="quantity-input-Omnia Muffin Ring"
                  />
                  <input
                    class="chakra-input emotion-2"
                    data-testid="quantity-input-Omnia Muffin Ring"
                    id="quantity-input-Omnia Muffin Ring"
                    name="quantity-input-Omnia Muffin Ring"
                    type="number"
                    value="79"
                  />
                </td>
                <td>
                  <button
                    class="underline underline-offset-1 text-blue-700 w-full"
                    name="orders"
                    type="button"
                  >
                    2
                  </button>
                </td>
                <td>
                  <button
                    class="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center w-full"
                    data-testid="update-quantity-Omnia Muffin Ring"
                    type="button"
                  >
                    Update
                  </button>
                </td>
              </tr>
              <tr
                class="emotion-2"
                role="row"
              >
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <button
                    class="underline underline-offset-1 text-blue-700"
                    name="Omnia Mould Duo"
                    type="button"
                  >
                    Omnia Mould Duo
                  </button>
                </td>
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <label
                    for="quantity-input-Omnia Mould Duo"
                  />
                  <input
                    class="chakra-input emotion-2"
                    data-testid="quantity-input-Omnia Mould Duo"
                    id="quantity-input-Omnia Mould Duo"
                    name="quantity-input-Omnia Mould Duo"
                    type="number"
                    value="8"
                  />
                </td>
                <td>
                  <button
                    class="underline underline-offset-1 text-blue-700 w-full"
                    name="orders"
                    type="button"
                  >
                    1
                  </button>
                </td>
                <td>
                  <button
                    class="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center w-full"
                    data-testid="update-quantity-Omnia Mould Duo"
                    type="button"
                  >
                    Update
                  </button>
                </td>
              </tr>
              <tr
                class="emotion-2"
                role="row"
              >
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <button
                    class="underline underline-offset-1 text-blue-700"
                    name="Omnia Stovetop Kit"
                    type="button"
                  >
                    Omnia Stovetop Kit
                  </button>
                </td>
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <label
                    for="quantity-input-Omnia Stovetop Kit"
                  />
                  <input
                    class="chakra-input emotion-2"
                    data-testid="quantity-input-Omnia Stovetop Kit"
                    disabled=""
                    id="quantity-input-Omnia Stovetop Kit"
                    name="quantity-input-Omnia Stovetop Kit"
                    type="number"
                    value="0"
                  />
                </td>
                <td>
                  <button
                    class="w-full"
                    disabled=""
                  >
                    0
                  </button>
                </td>
                <td />
              </tr>
              <tr
                class="emotion-2"
                role="row"
              >
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <button
                    class="underline underline-offset-1 text-blue-700"
                    name="Omnia Oven Bag"
                    type="button"
                  >
                    Omnia Oven Bag
                  </button>
                </td>
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <label
                    for="quantity-input-Omnia Oven Bag"
                  />
                  <input
                    class="chakra-input emotion-2"
                    data-testid="quantity-input-Omnia Oven Bag"
                    id="quantity-input-Omnia Oven Bag"
                    name="quantity-input-Omnia Oven Bag"
                    type="number"
                    value="3"
                  />
                </td>
                <td>
                  <button
                    class="w-full"
                    disabled=""
                  >
                    0
                  </button>
                </td>
                <td>
                  <button
                    class="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center w-full"
                    data-testid="update-quantity-Omnia Oven Bag"
                    type="button"
                  >
                    Update
                  </button>
                </td>
              </tr>
              <tr
                class="emotion-2"
                role="row"
              >
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <button
                    class="underline underline-offset-1 text-blue-700"
                    name="Omnia Baking Rack"
                    type="button"
                  >
                    Omnia Baking Rack
                  </button>
                </td>
                <td
                  class="emotion-2"
                  role="gridcell"
                >
                  <label
                    for="quantity-input-Omnia Baking Rack"
                  />
                  <input
                    class="chakra-input emotion-2"
                    data-testid="quantity-input-Omnia Baking Rack"
                    id="quantity-input-Omnia Baking Rack"
                    name="quantity-input-Omnia Baking Rack"
                    type="number"
                    value="96"
                  />
                </td>
                <td>
                  <button
                    class="w-full"
                    disabled=""
                  >
                    0
                  </button>
                </td>
                <td>
                  <button
                    class="rounded-full bg-blue-500 pl-3 pr-3 text-white text-center w-full"
                    data-testid="update-quantity-Omnia Baking Rack"
                    type="button"
                  >
                    Update
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `);
  });
});
