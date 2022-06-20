import UserForm from "@/components/UserForm";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import type { NextPage } from "next";

const SignUp: NextPage = () => {
  return <UserForm isSignup={true} />;
};

export default SignUp;

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
