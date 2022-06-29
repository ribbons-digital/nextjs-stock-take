import ItemForm from "@/components/ItemForm";
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockItem, products } from "mocks/db";
import { useRouter } from "next/router";
import NewItem from "pages/items/new";
import Item from "pages/items/[itemId]";
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
  test.only("it should render the form correctly - New Item Form", async () => {
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
    await screen.findByLabelText(/in product/i);
    await screen.findByRole("radiogroup");
    // const selectExistingRadioBtn = await screen.findByLabelText(
    //   /existing products/i
    // );
    // const createNewRadioBtn = await screen.findByLabelText(/new product/i);
    // const existingProductMultiSelect = await screen.findByTestId(
    //   "products-select"
    // );
    const createNewProductInput = await screen.findByLabelText(/add new/i);
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
    await screen.findByRole("button", { name: "Add" });
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
        padding: 4px;
      }

      .emotion-5 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .emotion-5>*:not(style)~*:not(style) {
        margin-top: 5px;
        -webkit-margin-end: 0px;
        margin-inline-end: 0px;
        margin-bottom: 0px;
        -webkit-margin-start: 0px;
        margin-inline-start: 0px;
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
        vertical-align: top;
        cursor: pointer;
        position: relative;
      }

      .emotion-7 {
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
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
      }

      .emotion-8 {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-margin-start: 0.5rem;
        margin-inline-start: 0.5rem;
      }

      .emotion-9 {
        width: 100%;
        height: -webkit-fit-content;
        height: -moz-fit-content;
        height: fit-content;
        position: relative;
      }

      .emotion-10 {
        -webkit-padding-end: 2rem;
        padding-inline-end: 2rem;
        height: 8rem;
      }

      .emotion-10:focus,
      .emotion-10[data-focus] {
        z-index: unset;
      }

      .emotion-11 {
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

      .emotion-15 {
        display: block;
        text-align: start;
      }

      .emotion-16 {
        padding-top: 1px;
        padding-bottom: 1px;
      }

      .emotion-17 {
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
                Add
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
          <label
            class="text-xl font-bold mt-8 mb-4"
          >
            In Product:
          </label>
          <div
            class="chakra-radio-group emotion-4"
            role="radiogroup"
          >
            <div
              class="chakra-stack emotion-5"
            >
              <label
                class="chakra-radio emotion-6"
              >
                <input
                  checked=""
                  class="chakra-radio__input"
                  id="radio-:r1:"
                  name="select-products"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="radio"
                  value="1"
                />
                <span
                  aria-hidden="true"
                  class="chakra-radio__control emotion-7"
                />
                <span
                  class="chakra-radio__label emotion-8"
                >
                  Select existing products:
                </span>
              </label>
              <div
                class="chakra-select__wrapper emotion-9"
              >
                <select
                  class="chakra-select border-2 emotion-10"
                  data-testid="products-select"
                  disabled=""
                  multiple=""
                >
                  <option
                    value="1zLL0gbc2w959Fb41PWlT2"
                  >
                    Omnia Oven
                  </option>
                  <option
                    value="37ac9639-eaa8-4a9f-993a-c2ae13321a36"
                  >
                    Omnia Thermometer
                  </option>
                  <option
                    value="4ff5e92d-c0b6-4dec-af57-d87ece9f9770"
                  >
                    Omnia Potholder
                  </option>
                  <option
                    value="5333771d-e70e-441d-9079-9d39940f289f"
                  >
                    Omnia Mega Kit
                  </option>
                  <option
                    value="HePqRSIKIpzDxf9dhrfHsD"
                  >
                    Omnia Silicone Mould
                  </option>
                  <option
                    value="HePqRSIKIpzDxf9dhrfI2d"
                  >
                    Omnia Recipe Book
                  </option>
                  <option
                    value="I0y6V1x7qzC608VKmhtenS"
                  >
                    Omnia Muffin Ring
                  </option>
                  <option
                    value="I0y6V1x7qzC608VKmhttV4"
                  >
                    Omnia Mould Duo
                  </option>
                  <option
                    value="e9a585e3-822b-45b9-aa02-6cf4fdf6fe88"
                  >
                    Omnia Stovetop Kit
                  </option>
                  <option
                    value="yhyI8h1QSgFaZW7AprsFP5"
                  >
                    Omnia Oven Bag
                  </option>
                  <option
                    value="zz074YFsjUbDP9RwQZRluF"
                  >
                    Omnia Baking Rack
                  </option>
                </select>
                <div
                  class="chakra-select__icon-wrapper emotion-11"
                  data-disabled=""
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
              <label
                class="chakra-radio emotion-6"
                data-checked=""
              >
                <input
                  class="chakra-radio__input"
                  id="radio-:r2:"
                  name="new-product"
                  style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: nowrap; position: absolute;"
                  type="radio"
                  value="2"
                />
                <span
                  aria-hidden="true"
                  class="chakra-radio__control emotion-7"
                  data-checked=""
                />
                <span
                  class="chakra-radio__label emotion-8"
                  data-checked=""
                >
                  Create a new product:
                </span>
              </label>
              <label
                class="chakra-form__label emotion-15"
                for="product-name"
              >
                Product Name
              </label>
              <div
                class="flex item-center"
              >
                <div
                  class="flex flex-col w-full"
                >
                  <input
                    class="chakra-input emotion-16"
                    id="product-name"
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
                  class="chakra-button emotion-17"
                  type="button"
                >
                  Add Product
                </button>
              </div>
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

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    const item = {
      name: "Barebones Beacon Light - Antique Bronze",
      quantity: "20",
      cost: "24",
    };

    const itemNameInput = await screen.findByLabelText(/item name/i);
    const quantityInput = await screen.findByLabelText(/quantity/i);
    const inProductSelect = await screen.findByLabelText(/in product/i);
    const costInput = await screen.findByLabelText(/cost/i);
    const addBtn = await screen.findByRole("button", { name: /add/i });

    await act(async () => userEvent.click(addBtn));

    await waitFor(() => {
      expect(mockCreateItem).toHaveBeenCalledTimes(0);
      expect(router.push).toHaveBeenCalledTimes(0);
      expect(screen.getAllByText(/can't be empty/i)).toBeVisible();
      expect(screen.getByText(/select or create a product/i)).toBeVisible();
    });

    await userEvent.type(itemNameInput, item.name);
    await userEvent.type(quantityInput, item.quantity);
    await userEvent.type(costInput, item.cost);
    await userEvent.selectOptions(inProductSelect, products[2].name);
    await act(async () => userEvent.click(addBtn));

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

    mockGetItem.mockResolvedValueOnce([mockItem]);

    // arrange - render UI
    render(
      <QueryClientProvider client={queryClient}>
        <Item>
          <ItemForm item={mockItem} />
        </Item>
      </QueryClientProvider>
    );

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    const updateBtn = await screen.findByRole("button", { name: /update/i });
    const itemNameInput = await screen.findByLabelText(/item name/i);
    const quantityInput = await screen.findByLabelText(/quantity/i);
    const costInput = await screen.findByLabelText(/cost/i);

    expect(itemNameInput).toHaveValue(mockItem.name);
    expect(quantityInput).toHaveValue(String(mockItem.quantity));
    expect(costInput).toHaveValue(mockItem.cost ?? "");

    const updatedItem = {
      name: "Omnia Bag",
      quantity: 30,
      cost: 28,
    };

    await userEvent.clear(itemNameInput);
    await userEvent.type(itemNameInput, updatedItem.name);
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, String(updatedItem.quantity));
    await userEvent.clear(costInput);
    await userEvent.type(costInput, String(updatedItem.cost));
    expect(itemNameInput).toHaveValue(updatedItem.name);
    expect(quantityInput).toHaveValue(String(updatedItem.quantity));
    expect(costInput).toHaveValue(String(updatedItem.cost));

    await act(async () => userEvent.click(updateBtn));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith("/items");
      expect(mockUpdateItem).toBeCalledTimes(1);
      expect(mockUpdateItem).toBeCalledWith({
        id: mockItem._id,
        quantity: updatedItem.quantity,
        cost: updatedItem.cost,
        name: updatedItem.name,
        inProduct: mockItem.inProduct,
      });
    });
  });
});
