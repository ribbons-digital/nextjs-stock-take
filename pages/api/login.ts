import { supabase } from "services/supabase";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "lib/session";
import { User } from "@supabase/gotrue-js";

export type ResType = {
  token?: string | null;
  status: number;
  error?: string | null;
  user?: User | null;
};

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse<ResType>) {
  const { email, password } = req.body;
  const { user, error, session } = await supabase.auth.signIn({
    email,
    password,
  });

  if (error) {
    res.status(error.status).json({
      status: error.status,
      error: error.message,
    });
  }

  if (session?.access_token && user) {
    req.session.user = user;
    await req.session.save();

    res.status(200).json({ token: session.access_token, status: 200, user });
  }
}
