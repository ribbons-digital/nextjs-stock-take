/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Input, Button, FormControl, FormLabel, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

type PropTypes = {
  isSignup: boolean;
};

type LoginResType = {
  data: string;
  status: 200;
};

interface FormData {
  email: { value: string };
  password: { value: string };
}

export default function UserForm({ isSignup }: PropTypes) {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, password } = event.target as typeof event.target & FormData;
    // Get data from the form.
    const data = {
      email: email.value,
      password: password.value,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);

    // API endpoint where we send form data.
    const endpoint = `/api${isSignup ? "/signup" : "/login"}`;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = (await response.json()) as LoginResType;

    if (result.status === 200) {
      //   sessionStorage.setItem("token", result.data);
      router.push("/success");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <FormControl className="flex items-center flex-col">
        <div className="flex items-start flex-col w-1/2">
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input id="email" name="email" type="email" sx={{ py: 1 }} />
        </div>
        <div className="flex items-start flex-col w-1/2 mt-2">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input id="password" name="password" type="password" sx={{ py: 1 }} />
        </div>
        <div className="flex flex-col items-center w-1/2">
          <Button
            variant="solid"
            name={isSignup ? "signup" : "login"}
            type="submit"
            colorScheme="twitter"
            className="w-full mt-2"
          >
            {isSignup ? "Sign up" : "Log in"}
          </Button>
          <Text className="mt-4" colorScheme="twitter">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
          </Text>

          <Link href={isSignup ? "/login" : "/signup"}>
            <Button
              name="signup"
              variant="link"
              type="button"
              colorScheme="twitter"
            >
              {isSignup ? "Log in" : "Sign up"}
            </Button>
          </Link>
        </div>
      </FormControl>
    </form>
  );
}
