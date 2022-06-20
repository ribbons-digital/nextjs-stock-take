import { User } from "@supabase/gotrue-js";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import type { NextApiRequest, NextApiResponse } from "next";

export type ResType = {
  token?: string | null;
  status: number;
  error?: string | null;
  user?: User | null;
};

export default withIronSessionApiRoute(productsRoute, sessionOptions);

async function productsRoute(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {}
