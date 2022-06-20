/* eslint-disable react/no-unescaped-entities */
import { Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useAuth } from "lib/Auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

type PropTypes = {
  isSignup: boolean;
};

interface FormData {
  email: string;
  password: string;
}

export default function UserForm({ isSignup }: PropTypes) {
  const router = useRouter();

  const { signin } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (formData: FormData) => {
    const { email, password } = formData;

    // Get data from the form.
    const data = {
      email,
      password,
    };

    // // Send the data to the server in JSON format.
    // const JSONdata = JSON.stringify(data);

    // // API endpoint where we send form data.
    // const endpoint = `/api${isSignup ? "/signup" : "/login"}`;

    // // Form the request for sending data to the server.
    // const options = {
    //   // The method is POST because we are sending data.
    //   method: "POST",
    //   // Tell the server we're sending JSON.
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   // Body of the request is the JSON data we created above.
    //   body: JSONdata,
    // };

    // // Send the form data to our forms API on Vercel and get a response.
    // const response = await fetch(endpoint, options);

    // // Get the response data from server as JSON.
    // // If server returns the name submitted, that means the form works.
    // const result = (await response.json()) as ResType;

    const result = await signin(email, password);

    if (result.status === 200) {
      //   sessionStorage.setItem("token", result.data);
      router.push("/");
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <FormControl className="flex items-center flex-col">
        <div className="flex items-start flex-col w-1/2">
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Please enter a valid email address",
            })}
            sx={{ py: 1 }}
          />
          <p className="text-red-600" role="alert">
            {errors.email && errors.email.message}
          </p>
        </div>
        <div className="flex items-start flex-col w-1/2 mt-2">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            {...register("password", {
              required: "Please enter a password",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            sx={{ py: 1 }}
          />
          <p className="text-red-600" role="alert">
            {errors.password && errors.password.message}
          </p>
        </div>
        <div className="flex flex-col items-center w-1/2">
          <Button
            variant="solid"
            name={isSignup ? "signup" : "login"}
            type="submit"
            colorScheme="twitter"
            className="w-full mt-2"
            isLoading={isSubmitting}
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
