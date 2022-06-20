import { User } from "@supabase/gotrue-js";
import type { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  password: process.env.NEXT_PUBLIC_SESSION_STORAGE_SECRET as string,
  cookieName: "supabase-auth-cookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User | null;
  }
}
