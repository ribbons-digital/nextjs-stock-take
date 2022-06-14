import { supabase } from "services/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from 'cookies'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;
  const myCookies = new Cookies(req, res)
  const { user, error, session } = await supabase.auth.signIn({
    email,
    password,
  });

  myCookies.set("_session", session?.access_token, {
    httpOnly: process.env.NODE_ENV === "development",
  })

  res.status(200).json({ data: session?.access_token, status: 200 });

  //   supabase.auth.api.setAuthCookie(req, res);
}
