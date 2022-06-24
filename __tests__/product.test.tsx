import ProductForm from "@/components/ProductForm";
import { userEvent } from "@storybook/testing-library";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { items, product0 } from "mocks/db";
import NewProduct from "pages/products/new";
import Product from "pages/products/[productId]";
import { QueryClient, QueryClientProvider } from "react-query";
import { getItems } from "services/sanity/item";
import { getProduct } from "services/sanity/product";
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

jest.mock("../services/sanity/item");
jest.mock("../services/sanity/product");
const mockGetItems = getItems as jest.MockedFunction<typeof getItems>;
const mockGetProduct = getProduct as jest.MockedFunction<typeof getProduct>;

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

describe("Product page", () => {
  test("it should load the form correctly - New Product Form", async () => {
    const queryClient = new QueryClient();
    mockGetItems.mockResolvedValueOnce(items);
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <NewProduct>
          <ProductForm items={items} />
        </NewProduct>
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    await screen.findByRole("button", { name: /go back/i });
    await screen.findByRole("button", { name: /add/i });
    await screen.findByLabelText(/product name/i);

    expect(mockGetItems).toBeCalledTimes(1);
    expect(container.firstChild).toMatchInlineSnapshot(`
      .emotion-1 {
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

      .emotion-3 {
        display: block;
        text-align: start;
      }

      .emotion-4 {
        padding-top: 1px;
        padding-bottom: 1px;
      }

      <form>
        <div
          class="chakra-form-control container mx-auto max-w-4xl p-4 emotion-0"
          role="group"
        >
          <div
            class="w-full flex justify-between mb-2"
          >
            <button
              class="chakra-button emotion-1"
              type="button"
            >
              Go back
            </button>
            <button
              class="chakra-button emotion-1"
              name="submit"
              type="submit"
            >
              Add
            </button>
          </div>
          <label
            class="chakra-form__label emotion-3"
            for="product-name"
            id="field-:r0:-label"
          >
            Product Name
          </label>
          <input
            class="chakra-input emotion-4"
            id="product-name"
            name="productName"
            type="text"
            value=""
          />
          <p
            class="text-red-600"
            role="alert"
          />
        </div>
      </form>
    `);
  });

  test("it should load the form correctly - Edit Product Form", async () => {
    const queryClient = new QueryClient();
    mockGetItems.mockResolvedValueOnce(items);
    mockGetProduct.mockResolvedValueOnce(product0);
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Product>
          <ProductForm items={items} product={product0[0]} />
        </Product>
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    await screen.findByRole("button", { name: /go back/i });
    await screen.findByRole("button", { name: /update/i });
    const addItembtn = await screen.findByRole("button", { name: /add item/i });
    await screen.findByRole("button", { name: /delete/i });
    const itemSelect = await screen.findByRole("combobox", { name: /item/i });
    await screen.findByLabelText(/product name/i);
    screen.getByRole("row", { name: /omnia oven/i });
    screen.getByRole("gridcell", { name: /omnia oven/i });
    screen.getByRole("gridcell", { name: /2/i });
    screen.getByRole("columnheader", { name: /item name/i });
    screen.getByRole("columnheader", { name: /quantity/i });
    screen.getByRole("columnheader", { name: /action/i });
    screen.getByRole("cell", { name: /delete/i });

    expect(screen.getAllByRole("row").length).toBe(product0.length + 1);

    expect(mockGetItems).toBeCalledTimes(1);
    expect(mockGetProduct).toBeCalledTimes(1);
    expect(itemSelect).toHaveValue("");
    expect(addItembtn).toBeDisabled();
    userEvent.selectOptions(itemSelect, items[1].name);
    expect(itemSelect).toHaveValue(items[1]._id);
    expect(addItembtn).not.toBeDisabled();

    expect(container.firstChild).toMatchInlineSnapshot(`
      .emotion-1 {
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

      .emotion-3 {
        display: block;
        text-align: start;
      }

      .emotion-4 {
        padding-top: 1px;
        padding-bottom: 1px;
      }

      .emotion-5 {
        border: 0;
        border-bottom-width: 1px;
        width: 100%;
      }

      .emotion-6 {
        padding-top: 1px;
        padding-bottom: 1px;
        width: 100%;
      }

      .emotion-8 {
        width: 100%;
        height: -webkit-fit-content;
        height: -moz-fit-content;
        height: fit-content;
        position: relative;
      }

      .emotion-9 {
        -webkit-padding-end: 2rem;
        padding-inline-end: 2rem;
      }

      .emotion-9:focus,
      .emotion-9[data-focus] {
        z-index: unset;
      }

      .emotion-10 {
        position: absolute;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        pointer-events: none;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
      }

      .emotion-12 {
        display: block;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        overflow-x: auto;
        overflow-y: hidden;
        max-width: 100%;
      }

      <form>
        <div
          class="chakra-form-control container mx-auto max-w-4xl p-4 emotion-0"
          role="group"
        >
          <div
            class="w-full flex justify-between mb-2"
          >
            <button
              class="chakra-button emotion-1"
              type="button"
            >
              Go back
            </button>
            <button
              class="chakra-button emotion-1"
              name="submit"
              type="submit"
              value="1zLL0gbc2w959Fb41PWlT2"
            >
              Update
            </button>
          </div>
          <label
            class="chakra-form__label emotion-3"
            for="product-name"
            id="field-:r1:-label"
          >
            Product Name
          </label>
          <input
            class="chakra-input emotion-4"
            id="product-name"
            name="productName"
            type="text"
            value="Omnia Oven"
          />
          <p
            class="text-red-600"
            role="alert"
          />
          <div
            class="w-full mt-6"
          >
            <label
              class="text-xl font-bold"
              id="items"
            >
              Item(s):
            </label>
            <hr
              aria-orientation="horizontal"
              class="chakra-divider my-2 emotion-5"
            />
            <div
              class="chakra-form-control emotion-6"
              role="group"
            >
              <label
                class="chakra-form__label emotion-3"
                data-focus=""
                for="selected-item"
                id="demo-simple-select-helper-label"
              >
                Item
              </label>
              <div
                class="chakra-select__wrapper emotion-8"
              >
                <select
                  class="chakra-select emotion-9"
                  id="selected-item"
                >
                  <option
                    value=""
                  >
                    Choose an item
                  </option>
                  <option />
                  <option
                    value="20f8a7fe-7944-4652-8bca-407973e1536e"
                  >
                    Omnia Oven Bag
                  </option>
                  <option
                    value="27a2ada7-0f93-499b-b2e3-e50f7746adbc"
                  >
                    Omnia Potholder
                  </option>
                  <option
                    value="3a3baeee-cba0-43b5-aff9-8be391b1c61a"
                  >
                    Omnia Muffin Ring
                  </option>
                  <option
                    value="62d7300b-de79-4c99-8c04-f4291396777c"
                  >
                    Omnia Thermometer
                  </option>
                  <option
                    value="ad908295-836b-4d9d-8a20-935d1d0f03e8"
                  >
                    Omnia Mould Duo
                  </option>
                  <option
                    value="e8b4e686-a338-4ab5-87f2-bad82ffa647e"
                  >
                    Omnia Silicon Mould
                  </option>
                  <option
                    value="ebf18fca-49ac-42a0-9f1e-26902a04a103"
                  >
                    Omnia Baking Rack
                  </option>
                  <option
                    value="ee526e35-f6ed-4b32-ae7c-f8d81a500e0c"
                  >
                    Omnia Recipe Book
                  </option>
                </select>
                <div
                  class="chakra-select__icon-wrapper emotion-10"
                >
                  <svg
                    aria-hidden="true"
                    class="chakra-select__icon"
                    focusable="false"
                    role="presentation"
                    style="width: 1em; height: 1em; color: currentColor;"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <button
              class="chakra-button w-full mb-4 emotion-1"
              name="addItem"
              type="button"
            >
              + Add Item
            </button>
            <div
              class="chakra-table__container emotion-12"
            >
              <table
                class="chakra-table emotion-0"
                role="table"
              >
                <thead
                  class="emotion-0"
                >
                  <tr
                    class="emotion-0"
                    role="row"
                  >
                    <th
                      class="emotion-0"
                    >
                      Item Name
                    </th>
                    <th
                      class="emotion-0"
                    >
                      Quantity
                    </th>
                    <th
                      class="emotion-0"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="emotion-0"
                >
                  <tr
                    class="emotion-0"
                    role="row"
                  >
                    <td
                      class="emotion-0"
                      role="gridcell"
                    >
                      Omnia Oven
                    </td>
                    <td
                      class="emotion-0"
                      role="gridcell"
                    >
                      2
                    </td>
                    <td>
                      <button
                        class="chakra-button text-white emotion-1"
                        name="deleteItem"
                        type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </form>
    `);
  });
});
