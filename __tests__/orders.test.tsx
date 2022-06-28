import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockOrders } from "mocks/db";
import { useRouter } from "next/router";
import Orders from "pages/orders";
import { QueryClient, QueryClientProvider } from "react-query";
import "whatwg-fetch";
import { server } from "../mocks/server";

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

describe("Orders", () => {
  test("it should render loading", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Orders />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  test("it should render orders", async () => {
    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Orders />
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    screen.getByRole("columnheader", { name: /order number/i });
    screen.getByRole("columnheader", { name: /ordered date/i });
    screen.getByRole("columnheader", { name: /quantity/i });

    expect(screen.getAllByRole("row").length).toBe(mockOrders.length + 1);
    screen.getByRole("gridcell", { name: mockOrders[0].orderNumber });
    screen.getByRole("gridcell", { name: mockOrders[1].orderNumber });
    screen.getByRole("gridcell", { name: mockOrders[2].orderNumber });
    screen.getByRole("gridcell", { name: mockOrders[3].orderNumber });
    screen.getByRole("gridcell", { name: mockOrders[4].orderNumber });
    screen.getByRole("gridcell", { name: mockOrders[5].orderNumber });
    screen.getByRole("gridcell", { name: mockOrders[6].orderNumber });
    screen.getByRole("gridcell", { name: mockOrders[7].orderNumber });
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
            + Add New Order
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
                  Order Number
                </th>
                <th
                  class="emotion-5"
                >
                  Ordered Date
                </th>
                <th
                  class="emotion-5"
                >
                  Quantity
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
                    name="1212"
                    type="button"
                  >
                    1212
                  </button>
                </td>
                <td>
                  2022-05-29
                </td>
                <td>
                  2
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
                    name="12111"
                    type="button"
                  >
                    12111
                  </button>
                </td>
                <td>
                  2022-05-30
                </td>
                <td>
                  1
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
                    name="11122"
                    type="button"
                  >
                    11122
                  </button>
                </td>
                <td>
                  2022-05-30
                </td>
                <td>
                  2
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
                    name="4434"
                    type="button"
                  >
                    4434
                  </button>
                </td>
                <td>
                  2022-05-18
                </td>
                <td>
                  1
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
                    name="44343"
                    type="button"
                  >
                    44343
                  </button>
                </td>
                <td>
                  2022-05-31
                </td>
                <td>
                  2
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
                    name="1213"
                    type="button"
                  >
                    1213
                  </button>
                </td>
                <td>
                  2022-05-29
                </td>
                <td>
                  1
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
                    name="1111"
                    type="button"
                  >
                    1111
                  </button>
                </td>
                <td>
                  2022-05-30
                </td>
                <td>
                  1
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
                    name="2344"
                    type="button"
                  >
                    2344
                  </button>
                </td>
                <td>
                  2022-05-25
                </td>
                <td>
                  1
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `);
  });

  test("it should go to the new order page when clicking on Add New Order button", async () => {
    const router = useRouter();
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Orders />
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    const addNewOrderBtn = await screen.findByRole("button", {
      name: /add new order/i,
    });
    userEvent.click(addNewOrderBtn);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toBeCalledWith(`/orders/new`);
    });
  });
});
