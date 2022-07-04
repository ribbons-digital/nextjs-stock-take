import ItemForm from "@/components/ItemForm";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockItem, products } from "mocks/db";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import NewItem from "pages/items/new";
import Item, { getServerSideProps } from "pages/items/[itemId]";
import { ParsedUrlQuery } from "querystring";
import { QueryClient, QueryClientProvider } from "react-query";
import { createItem, getItem, updateItem } from "services/sanity/item";
import { createProduct, getProducts } from "services/sanity/product";
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
jest.mock("../services/sanity/item");
const mockCreateProduct = createProduct as jest.MockedFunction<
  typeof createProduct
>;
const mockCreateItem = createItem as jest.MockedFunction<typeof createItem>;
const mockGetItem = getItem as jest.MockedFunction<typeof getItem>;
const mockUpdateItem = updateItem as jest.MockedFunction<typeof updateItem>;
const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;

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

describe("New Item and Edit Item pages", () => {
  test("it should render the form correctly - New Item Form", async () => {
    mockGetProducts.mockResolvedValueOnce(products);
    // arrange
    const queryClient = new QueryClient();

    // arrange - render UI
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <NewItem>
          <ItemForm />
        </NewItem>
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/fetching products/i));

    await screen.findByLabelText(/item name/i);
    await screen.findByLabelText(/quantity/i);
    await screen.findByText(/in product/i);
    // await screen.findByRole("radiogroup");
    // const selectExistingRadioBtn = await screen.findByLabelText(
    //   /existing products/i
    // );
    // const createNewRadioBtn = await screen.findByLabelText(/new product/i);
    // const existingProductMultiSelect = await screen.findByTestId(
    //   "products-select"
    // );
    const createNewProductInput = await screen.findByLabelText(
      /add a new product/i
    );
    const addProductBtn = await screen.findByRole("button", {
      name: "Add Product",
    });

    // expect(selectExistingRadioBtn).toBeChecked();
    // expect(createNewRadioBtn).not.toBeChecked();
    // expect(createNewProductInput).toBeDisabled();

    // await userEvent.click(createNewRadioBtn);

    // expect(selectExistingRadioBtn).not.toBeChecked();
    // expect(createNewRadioBtn).toBeChecked();
    // expect(existingProductMultiSelect).toBeDisabled();
    // expect(createNewProductInput).not.toBeDisabled();
    expect(addProductBtn).toBeDisabled();
    await userEvent.type(createNewProductInput, "Abc");
    expect(addProductBtn).not.toBeDisabled();
    await userEvent.clear(createNewProductInput);
    await userEvent.click(addProductBtn);
    expect(screen.getByText(/enter a product name/i)).toBeVisible();

    await screen.findByLabelText(/cost/i);
    await screen.findByRole("button", { name: /create/i });
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
        padding-top: 1px;
        padding-bottom: 1px;
        width: 100%;
      }

      .emotion-4 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        height: 12rem;
        overflow: scroll;
        border: 1px;
        padding: 2px;
        border-color: gray;
      }

      .emotion-4>*:not(style)~*:not(style) {
        margin-top: 5px;
        -webkit-margin-end: 0px;
        margin-inline-end: 0px;
        margin-bottom: 0px;
        -webkit-margin-start: 0px;
        margin-inline-start: 0px;
      }

      .emotion-5 {
        cursor: pointer;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        vertical-align: top;
        position: relative;
      }

      .emotion-6 {
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
        vertical-align: top;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
      }

      .emotion-7 {
        -webkit-margin-start: 0.5rem;
        margin-inline-start: 0.5rem;
      }

      .emotion-38 {
        padding-top: 1px;
        padding-bottom: 1px;
      }

      .emotion-39 {
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
        margin-left: 4px;
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
                Create
              </button>
            </div>
          </div>
          <label
            class="text-xl font-bold mt-8"
            for="item-name"
          >
            Item Name:
          </label>
          <input
            class="chakra-input emotion-2"
            id="item-name"
            name="itemName"
            type="text"
            value=""
          />
          <label
            class="text-xl font-bold mt-8"
            for="quanitty"
          >
            Quantity:
          </label>
          <input
            class="chakra-input border-2 emotion-3"
            id="quanitty"
            name="quantity"
            type="text"
            value=""
          />
          <div
            class="text-xl font-bold mt-8 mb-4"
          >
            In Product:
          </div>
          <div
            class="px-2"
          >
            <label
              class="my-2"
              for="select-existing-products"
            >
              Select existing products:
            </label>
            <div
              class="chakra-stack emotion-4"
              id="select-existing-products"
            >
              <label
                class="chakra-checkbox emotion-5"
              >
                <input
                  class="chakra-checkbox__input"
                  name="inProducts"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="checkbox"
                  value="1zLL0gbc2w959Fb41PWlT2"
                />
                <span
                  aria-hidden="true"
                  class="chakra-checkbox__control emotion-6"
                />
                <span
                  class="chakra-checkbox__label emotion-7"
                >
                  Omnia Oven
                </span>
              </label>
              <label
                class="chakra-checkbox emotion-5"
              >
                <input
                  class="chakra-checkbox__input"
                  name="inProducts"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="checkbox"
                  value="37ac9639-eaa8-4a9f-993a-c2ae13321a36"
                />
                <span
                  aria-hidden="true"
                  class="chakra-checkbox__control emotion-6"
                />
                <span
                  class="chakra-checkbox__label emotion-7"
                >
                  Omnia Thermometer
                </span>
              </label>
              <label
                class="chakra-checkbox emotion-5"
              >
                <input
                  class="chakra-checkbox__input"
                  name="inProducts"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="checkbox"
                  value="4ff5e92d-c0b6-4dec-af57-d87ece9f9770"
                />
                <span
                  aria-hidden="true"
                  class="chakra-checkbox__control emotion-6"
                />
                <span
                  class="chakra-checkbox__label emotion-7"
                >
                  Omnia Potholder
                </span>
              </label>
              <label
                class="chakra-checkbox emotion-5"
              >
                <input
                  class="chakra-checkbox__input"
                  name="inProducts"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="checkbox"
                  value="5333771d-e70e-441d-9079-9d39940f289f"
                />
                <span
                  aria-hidden="true"
                  class="chakra-checkbox__control emotion-6"
                />
                <span
                  class="chakra-checkbox__label emotion-7"
                >
                  Omnia Mega Kit
                </span>
              </label>
              <label
                class="chakra-checkbox emotion-5"
              >
                <input
                  class="chakra-checkbox__input"
                  name="inProducts"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="checkbox"
                  value="HePqRSIKIpzDxf9dhrfHsD"
                />
                <span
                  aria-hidden="true"
                  class="chakra-checkbox__control emotion-6"
                />
                <span
                  class="chakra-checkbox__label emotion-7"
                >
                  Omnia Silicone Mould
                </span>
              </label>
              <label
                class="chakra-checkbox emotion-5"
              >
                <input
                  class="chakra-checkbox__input"
                  name="inProducts"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="checkbox"
                  value="HePqRSIKIpzDxf9dhrfI2d"
                />
                <span
                  aria-hidden="true"
                  class="chakra-checkbox__control emotion-6"
                />
                <span
                  class="chakra-checkbox__label emotion-7"
                >
                  Omnia Recipe Book
                </span>
              </label>
              <label
                class="chakra-checkbox emotion-5"
              >
                <input
                  class="chakra-checkbox__input"
                  name="inProducts"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="checkbox"
                  value="I0y6V1x7qzC608VKmhtenS"
                />
                <span
                  aria-hidden="true"
                  class="chakra-checkbox__control emotion-6"
                />
                <span
                  class="chakra-checkbox__label emotion-7"
                >
                  Omnia Muffin Ring
                </span>
              </label>
              <label
                class="chakra-checkbox emotion-5"
              >
                <input
                  class="chakra-checkbox__input"
                  name="inProducts"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="checkbox"
                  value="I0y6V1x7qzC608VKmhttV4"
                />
                <span
                  aria-hidden="true"
                  class="chakra-checkbox__control emotion-6"
                />
                <span
                  class="chakra-checkbox__label emotion-7"
                >
                  Omnia Mould Duo
                </span>
              </label>
              <label
                class="chakra-checkbox emotion-5"
              >
                <input
                  class="chakra-checkbox__input"
                  name="inProducts"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="checkbox"
                  value="e9a585e3-822b-45b9-aa02-6cf4fdf6fe88"
                />
                <span
                  aria-hidden="true"
                  class="chakra-checkbox__control emotion-6"
                />
                <span
                  class="chakra-checkbox__label emotion-7"
                >
                  Omnia Stovetop Kit
                </span>
              </label>
              <label
                class="chakra-checkbox emotion-5"
              >
                <input
                  class="chakra-checkbox__input"
                  name="inProducts"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="checkbox"
                  value="yhyI8h1QSgFaZW7AprsFP5"
                />
                <span
                  aria-hidden="true"
                  class="chakra-checkbox__control emotion-6"
                />
                <span
                  class="chakra-checkbox__label emotion-7"
                >
                  Omnia Oven Bag
                </span>
              </label>
              <label
                class="chakra-checkbox emotion-5"
              >
                <input
                  class="chakra-checkbox__input"
                  name="inProducts"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="checkbox"
                  value="zz074YFsjUbDP9RwQZRluF"
                />
                <span
                  aria-hidden="true"
                  class="chakra-checkbox__control emotion-6"
                />
                <span
                  class="chakra-checkbox__label emotion-7"
                >
                  Omnia Baking Rack
                </span>
              </label>
            </div>
            <label
              class="my-2"
              for="add-new-product"
            >
              Add a new product:
            </label>
            <div
              class="flex item-center"
            >
              <div
                class="flex flex-col w-full"
              >
                <input
                  class="chakra-input emotion-38"
                  id="add-new-product"
                  name="productName"
                  type="text"
                />
                <p
                  class="text-red-600"
                  role="alert"
                >
                  Please enter a product name
                </p>
              </div>
              <button
                class="chakra-button emotion-39"
                type="button"
              >
                Add Product
              </button>
            </div>
          </div>
          <label
            class="text-xl font-bold mt-8"
            for="costPerItem"
          >
            Cost:
          </label>
          <input
            class="chakra-input border-2 emotion-3"
            id="costPerItem"
            name="costPerItem"
            type="text"
            value=""
          />
        </div>
      </form>
    `);
  });

  test("it should function correctly - New Item Form", async () => {
    mockGetProducts.mockResolvedValueOnce(products);
    // @ts-ignore
    mockCreateItem.mockResolvedValueOnce({
      _createdAt: "2022-06-28T08:49:23Z",
      _id: "yhyI8h1QSgFaZW7ArErYst",
      _rev: "yhyI8h1QSgFaZW7ArErYop",
      _type: "item",
      _updatedAt: "2022-06-28T08:49:23Z",
      cost: 24,
      name: "Barebones Beacon Light - Antique Bronze",
      quantity: "20",
    });
    // arrange
    const queryClient = new QueryClient();
    const router = useRouter();

    // arrange - render UI
    render(
      <QueryClientProvider client={queryClient}>
        <NewItem>
          <ItemForm />
        </NewItem>
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/fetching products/i));

    const item = {
      name: "Barebones Beacon Light - Antique Bronze",
      quantity: "20",
      cost: "24",
    };

    const itemNameInput = await screen.findByLabelText(/item name/i);
    const quantityInput = await screen.findByLabelText(/quantity/i);
    const selectProductCheckboxes = await screen.findAllByRole("checkbox");
    const costInput = await screen.findByLabelText(/cost/i);
    const createBtn = await screen.findByRole("button", { name: /create/i });

    await userEvent.click(createBtn);

    await waitFor(async () => {
      expect(mockCreateItem).toHaveBeenCalledTimes(0);
      expect(router.push).toHaveBeenCalledTimes(0);
      expect(screen.getAllByText(/can't be empty/i)).toHaveLength(3);
      expect(screen.getByText(/select one or more products/i)).toBeVisible();
    });

    await userEvent.type(itemNameInput, item.name);
    await userEvent.type(quantityInput, item.quantity);
    await userEvent.type(costInput, item.cost);
    await userEvent.click(selectProductCheckboxes[0]);
    expect(selectProductCheckboxes[0]).toBeChecked();
    await userEvent.click(createBtn);

    await waitFor(() => {
      expect(mockCreateItem).toHaveBeenCalledTimes(1);
      expect(mockCreateItem).toHaveBeenCalledWith({
        name: item.name,
        quantity: item.quantity,
        cost: Number(item.cost),
      });
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith(`/items/yhyI8h1QSgFaZW7ArErYst`);
    });
  });

  test("it should funciton correctly - Edit Item Form", async () => {
    // arrange
    const queryClient = new QueryClient();
    const router = useRouter();

    mockGetProducts.mockResolvedValueOnce(products);
    mockGetItem.mockResolvedValueOnce([mockItem]);

    const inProducts = [
      "5333771d-e70e-441d-9079-9d39940f289f",
      "yhyI8h1QSgFaZW7AprsFP5",
    ];

    // arrange - render UI
    render(
      <QueryClientProvider client={queryClient}>
        <Item item={mockItem} inProducts={inProducts} />
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/fetching products/i));

    const context = {
      query: {
        itemId: mockItem._id,
      } as ParsedUrlQuery,
    };

    const value = await getServerSideProps(
      context as GetServerSidePropsContext
    );

    expect(value).toEqual({
      props: {
        item: mockItem,
        inProducts,
      },
    });

    const updateBtn = await screen.findByRole("button", { name: /update/i });
    const itemNameInput = await screen.findByLabelText(/item name/i);
    const quantityInput = await screen.findByLabelText(/quantity/i);
    const selectProductCheckboxes = await screen.findAllByRole("checkbox");
    const costInput = await screen.findByLabelText(/cost/i);

    expect(itemNameInput).toHaveValue(mockItem.name);
    expect(quantityInput).toHaveValue(String(mockItem.quantity));
    expect(selectProductCheckboxes[3]).toBeChecked();
    expect(selectProductCheckboxes[9]).toBeChecked();
    expect(costInput).toHaveValue(mockItem.cost ?? "");

    const updatedItem = {
      name: "Omnia Bag",
      quantity: 30,
      cost: 28,
    };

    await userEvent.clear(itemNameInput);
    await userEvent.type(itemNameInput, updatedItem.name);
    await userEvent.clear(quantityInput);
    await userEvent.click(selectProductCheckboxes[9]);
    await userEvent.click(selectProductCheckboxes[1]);
    await userEvent.type(quantityInput, String(updatedItem.quantity));
    await userEvent.clear(costInput);
    await userEvent.type(costInput, String(updatedItem.cost));
    expect(itemNameInput).toHaveValue(updatedItem.name);
    expect(quantityInput).toHaveValue(String(updatedItem.quantity));
    expect(costInput).toHaveValue(String(updatedItem.cost));

    await userEvent.click(updateBtn);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith("/items");
      expect(mockUpdateItem).toBeCalledTimes(1);
      expect(mockUpdateItem).toBeCalledWith({
        id: mockItem._id,
        quantity: updatedItem.quantity,
        cost: updatedItem.cost,
        name: updatedItem.name,
      });
    });
  });
});
