import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import LoginPage from "../pages/login";
import { ReactElement } from "react";
import React from "react";
import Link from "next/link";

// jest.mock(
//   "next/link",
//   () =>
//     ({ children, ...rest }: { children: ReactElement }) =>
//       React.cloneElement(children, { ...rest })
// );
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

  //   test("The Login page - clicking on sign up button should go to Sign Up page", async () => {
  //     const user = userEvent.setup();

  //     const { debug } = render(<LoginPage />);
  //     const signUpBtn = screen.getByRole("button", { name: /sign up/i });

  //     await user.click(signUpBtn);

  //     // expect(signUpBtn).toHaveBeenCalled();
  //     expect(screen.getByText(/sign up/i).closest("link")).toHaveAttribute(
  //       "href",
  //       "/signup"
  //     );
  //     // const loginText = getByText(/already have an account/i);
  //     // expect(loginText).toBeInTheDocument();
  //   });
});
