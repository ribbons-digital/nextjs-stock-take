/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Input, Button, FormControl, FormLabel, Text } from "@chakra-ui/react";
import Link from "next/link";

type PropTypes = {
  isSignup: boolean;
};

export default function UserForm({ isSignup }: PropTypes) {
  return (
    <form>
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
