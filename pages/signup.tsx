import UserForm from "@/components/UserForm";
import type { NextPage } from "next";

const SignUp: NextPage = () => {
  return <UserForm isSignup={true} />;
};

export default SignUp;
