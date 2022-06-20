import "whatwg-fetch";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import LoginPage from "../pages/login";
import { ReactElement } from "react";
import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { useRouter } from "next/router";

import Link from "next/link";

const server = setupServer(
  rest.post("/api/login", (req, res, ctx) => {
    return res(
      ctx.json({
        status: 200,
        data: "token",
        user: {
          id: "f2ec2c12-aac8-4f40-be89-f6a642edd756",
          aud: "authenticated",
          role: "authenticated",
          email: "just.shiang@gmail.com",
          email_confirmed_at: "2022-06-01T05:37:45.690931Z",
          phone: "",
          confirmation_sent_at: "2022-06-01T05:37:22.038811Z",
          confirmed_at: "2022-06-01T05:37:45.690931Z",
          last_sign_in_at: "2022-06-14T08:15:42.550584722Z",
          app_metadata: {
            provider: "email",
            providers: ["email"],
          },
          user_metadata: {},
          identities: [
            {
              id: "f2ec2c12-aac8-4f40-be89-f6a642edd756",
              user_id: "f2ec2c12-aac8-4f40-be89-f6a642edd756",
              identity_data: {
                sub: "f2ec2c12-aac8-4f40-be89-f6a642edd756",
              },
              provider: "email",
              last_sign_in_at: "2022-06-01T05:37:22.035059Z",
              created_at: "2022-06-01T05:37:22.035111Z",
              updated_at: "2022-06-01T05:37:22.035115Z",
            },
          ],
          created_at: "2022-06-01T05:37:22.005321Z",
          updated_at: "2022-06-14T08:15:42.55173Z",
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
// beforeEach(() => jest.resetAllMocks());
afterEach(() => {
  server.resetHandlers();
});

// jest.mock(
//   "next/link",
//   () =>
//     ({ children, ...rest }: { children: ReactElement }) =>
//       React.cloneElement(children, { ...rest })
// );

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

jest.mock(
  "next/link",
  () =>
    ({ children }: { children: ReactElement }) =>
      children
);

describe("Login Page", () => {
  test("The Login page should load correctly", async () => {
    const { findByText, findByLabelText, container } = render(<LoginPage />);
    findByLabelText("Email");
    findByLabelText("Password");
    findByText(/log in/i);
    findByText(/sign up/i);
    expect(container.firstChild).toMatchInlineSnapshot(`
      .emotion-1 {
        display: block;
        text-align: start;
      }

      .emotion-2 {
        padding-top: 1px;
        padding-bottom: 1px;
      }

      .emotion-5 {
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

      <form>
        <div
          class="chakra-form-control flex items-center flex-col emotion-0"
          role="group"
        >
          <div
            class="flex items-start flex-col w-1/2"
          >
            <label
              class="chakra-form__label emotion-1"
              for="email"
              id="field-:r0:-label"
            >
              Email
            </label>
            <input
              class="chakra-input emotion-2"
              id="email"
              name="email"
              type="email"
            />
            <p
              class="text-red-600"
              role="alert"
            />
          </div>
          <div
            class="flex items-start flex-col w-1/2 mt-2"
          >
            <label
              class="chakra-form__label emotion-1"
              for="password"
              id="field-:r0:-label"
            >
              Password
            </label>
            <input
              class="chakra-input emotion-2"
              id="password"
              name="password"
              type="password"
            />
            <p
              class="text-red-600"
              role="alert"
            />
          </div>
          <div
            class="flex flex-col items-center w-1/2"
          >
            <button
              class="chakra-button w-full mt-2 emotion-5"
              name="login"
              type="submit"
            >
              Log in
            </button>
            <p
              class="chakra-text mt-4 emotion-0"
            >
              Don't have an account?
            </p>
            <button
              class="chakra-button emotion-5"
              name="signup"
              type="button"
            >
              Sign up
            </button>
          </div>
        </div>
      </form>
    `);
  });

  test("Successful login should go to the home page", async () => {
    const user = userEvent.setup();
    const router = useRouter();

    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    const loginBtn = screen.getByRole("button", { name: /log in/i });

    await user.type(emailInput, "just.shiang@gmail.com");
    await user.type(passwordInput, "Q1w2e3r4t5");
    user.click(loginBtn);
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith("/");
    });
  });

  test("Submitting an empty form should display correct errors", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const loginBtn = screen.getByRole("button", { name: /log in/i });
    user.click(loginBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/please enter a password/i)).toBeInTheDocument();
    });
  });

  test("Submitting the form with invalid input format should display the correct error or not submit the form", async () => {
    const user = userEvent.setup();
    const router = useRouter();

    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    const loginBtn = screen.getByRole("button", { name: /log in/i });

    await user.type(emailInput, "just");
    user.click(loginBtn);
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledTimes(1);
    });
    await user.type(passwordInput, "www");
    user.click(loginBtn);
    await waitFor(() => {
      expect(screen.getByText(/6 characters/i)).toBeInTheDocument();
    });
  });
});
