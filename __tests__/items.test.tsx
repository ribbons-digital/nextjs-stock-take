import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockItems } from "mocks/db";
import { useRouter } from "next/router";
import Items from "pages/items";
import { QueryClient, QueryClientProvider } from "react-query";
import { getItems, updateItemQuantity } from "services/sanity/item";
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

jest.mock("../services/sanity/item");
const mockGetItems = getItems as jest.MockedFunction<typeof getItems>;
const mockUpdateItemQty = updateItemQuantity as jest.MockedFunction<
  typeof updateItemQuantity
>;

describe("Items", () => {
  test("it should render loading", async () => {
    mockGetItems.mockResolvedValueOnce(mockItems);
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Items />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  test("it should render items", async () => {
    mockGetItems.mockResolvedValueOnce(mockItems);
    // @ts-ignore
    mockUpdateItemQty.mockResolvedValueOnce({
      transactionId: "yhyI8h1QSgFaZW7ArE5FjH",
      results: [
        {
          id: "20f8a7fe-7944-4652-8bca-407973e1536e",
          document: {
            _createdAt: "2022-05-25T03:55:34Z",
            _id: "20f8a7fe-7944-4652-8bca-407973e1536e",
            _rev: "yhyI8h1QSgFaZW7ArE5FjH",
            _type: "item",
            _updatedAt: "2022-06-28T05:43:34Z",
            name: "Omnia Oven Bag",
            quantity: 2,
          },
          operation: "update",
        },
      ],
    });

    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Items />
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    screen.getByRole("columnheader", { name: /item name/i });
    screen.getByRole("columnheader", { name: /quantity/i });
    screen.getByRole("columnheader", { name: /action/i });
    const qtyInputs = screen.getAllByRole("spinbutton", { name: "" });
    const updateBtns = screen.getAllByRole("button", { name: /update/i });

    expect(qtyInputs[0]).toHaveValue(2);
    userEvent.clear(qtyInputs[0]);
    userEvent.type(qtyInputs[0], "3");
    await act(async () => userEvent.click(updateBtns[0]));
    await waitFor(() => {
      expect(qtyInputs[0]).toHaveValue(3);
      expect(mockUpdateItemQty).toHaveBeenCalled();
      expect(mockUpdateItemQty).toHaveBeenCalledTimes(1);
      expect(mockUpdateItemQty).toHaveBeenCalledWith({
        id: mockItems[0]._id,
        quantity: 3,
      });
    });

    expect(screen.getAllByRole("row").length).toBe(mockItems.length + 1);
    screen.getByRole("gridcell", { name: mockItems[0].name });
    screen.getByRole("gridcell", { name: mockItems[1].name });
    screen.getByRole("gridcell", { name: mockItems[2].name });
    screen.getByRole("gridcell", { name: mockItems[3].name });
    screen.getByRole("gridcell", { name: mockItems[4].name });
    screen.getByRole("gridcell", { name: mockItems[5].name });
    screen.getByRole("gridcell", { name: mockItems[6].name });
    screen.getByRole("gridcell", { name: mockItems[7].name });
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
            + Add New Item
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
                  class="emotion-2"
                >
                  Item Name
                </th>
                <th
                  class="emotion-2"
                >
                  Quantity
                </th>
                <th
                  class="emotion-2"
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
                    name="Omnia Oven Bag"
                    type="button"
                  >
                    Omnia Oven Bag
                  </button>
                </td>
                <td>
                  <input
                    class="chakra-input emotion-2"
                    name="quantity"
                    type="number"
                    value="2"
                  />
                </td>
                <td>
                  <button
                    class="chakra-button emotion-0"
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
                <td>
                  <input
                    class="chakra-input emotion-2"
                    name="quantity"
                    type="number"
                    value="30"
                  />
                </td>
                <td>
                  <button
                    class="chakra-button emotion-0"
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
                <td>
                  <input
                    class="chakra-input emotion-2"
                    name="quantity"
                    type="number"
                    value="79"
                  />
                </td>
                <td>
                  <button
                    class="chakra-button emotion-0"
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
                <td>
                  <input
                    class="chakra-input emotion-2"
                    name="quantity"
                    type="number"
                    value="71"
                  />
                </td>
                <td>
                  <button
                    class="chakra-button emotion-0"
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
                <td>
                  <input
                    class="chakra-input emotion-2"
                    name="quantity"
                    type="number"
                    value="8"
                  />
                </td>
                <td>
                  <button
                    class="chakra-button emotion-0"
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
                    name="Omnia Silicon Mould"
                    type="button"
                  >
                    Omnia Silicon Mould
                  </button>
                </td>
                <td>
                  <input
                    class="chakra-input emotion-2"
                    name="quantity"
                    type="number"
                    value="65"
                  />
                </td>
                <td>
                  <button
                    class="chakra-button emotion-0"
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
                <td>
                  <input
                    class="chakra-input emotion-2"
                    name="quantity"
                    type="number"
                    value="96"
                  />
                </td>
                <td>
                  <button
                    class="chakra-button emotion-0"
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
                    name="Omnia Oven"
                    type="button"
                  >
                    Omnia Oven
                  </button>
                </td>
                <td>
                  <input
                    class="chakra-input emotion-2"
                    name="quantity"
                    type="number"
                    value="-2"
                  />
                </td>
                <td>
                  <button
                    class="chakra-button emotion-0"
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
                <td>
                  <input
                    class="chakra-input emotion-2"
                    name="quantity"
                    type="number"
                    value="12"
                  />
                </td>
                <td>
                  <button
                    class="chakra-button emotion-0"
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

  test("it should go to the new item page when clicking on Add New Item button", async () => {
    mockGetItems.mockResolvedValueOnce(mockItems);
    const router = useRouter();
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Items />
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    const addNewItemBtn = await screen.findByRole("button", {
      name: /add new item/i,
    });
    userEvent.click(addNewItemBtn);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toBeCalledWith(`/items/new`);
    });
  });

  test("it should go to the the item page when clicking on an item in the item name column", async () => {
    mockGetItems.mockResolvedValueOnce(mockItems);
    const router = useRouter();
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Items />
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    const itemBtn = screen.getByRole("button", { name: mockItems[7].name });
    userEvent.click(itemBtn);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toBeCalledWith(`/items/${mockItems[7]._id}`);
    });
  });
});
