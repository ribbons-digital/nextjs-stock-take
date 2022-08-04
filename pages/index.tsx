import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import type { NextPage } from "next";
// import { trpc } from "../utils/trpc";
// import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div>
      <p>Home</p>
    </div>
  );
};

export default Home;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
},
sessionOptions);
