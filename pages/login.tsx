import UserForm from "@/components/UserForm";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import type { GetServerSideProps, NextPage } from "next";

const Login: NextPage = () => {
  return <UserForm isSignup={false} />;
};

export default Login;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const { user } = req.session;

  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
},
sessionOptions);
