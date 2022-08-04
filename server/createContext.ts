import { NextApiRequest, NextApiResponse } from "next";
// import { verifyJwt } from "../utils/jwt";
import { prisma } from "../utils/prisma";

interface CtxUser {
  id: string;
  email: string;
  name: string;
  iat: string;
  exp: number;
}

// function getUserFromRequest(req: NextApiRequest) {
//   const token = req.cookies.token;
//   if (token) {
//     try {
//       const user = verifyJwt<CtxUser>(token);
//       return user;
//     } catch (e) {
//       return null;
//     }
//   }

//   null;
// }

export function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  //   const user = req.session.user ?? null;
  return {
    req,
    res,
    prisma,
    // user,
  };
}

export type Context = ReturnType<typeof createContext>;
