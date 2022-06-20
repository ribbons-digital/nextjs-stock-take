import { supabase } from "services/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { ResType } from "./login";

export default withIronSessionApiRoute(signUpRoute, sessionOptions);

async function signUpRoute(req: NextApiRequest, res: NextApiResponse<ResType>) {
  const { email, password } = req.body;
  const { user, error, session } = await supabase.auth.signUp({
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
