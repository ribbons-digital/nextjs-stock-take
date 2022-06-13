import UserForm from "@/components/UserForm";
import type { GetServerSideProps, NextPage } from "next";

const Login: NextPage = () => {
  return <UserForm isSignup={false} />;
};

export default Login;
