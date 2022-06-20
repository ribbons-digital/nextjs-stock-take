import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiRequest, NextApiResponse } from "next/types";
import { ResType } from "./login";

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

function logoutRoute(req: NextApiRequest, res: NextApiResponse<ResType>) {
  req.session.destroy();
  res.json({ user: null, status: 200, token: "", error: null });
}
