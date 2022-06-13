import { supabase } from "services/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;
  const { user, error, session } = await supabase.auth.signIn({
    email,
    password,
  });

  res.status(200).json({ data: session?.access_token, status: 200 });
  //   supabase.auth.api.setAuthCookie(req, res);
}
