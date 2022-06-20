import { User } from "@supabase/supabase-js";
import { ResType } from "pages/api/login";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "services/supabase";

const authContext = createContext({
  signin: (email: string, password: string): Promise<ResType> =>
    Promise.resolve({
      status: 200,
      user: null,
      token: "",
      error: null,
    }),
  signout: (): Promise<ResType> =>
    Promise.resolve({
      status: 200,
      user: null,
      token: "",
      error: null,
    }),
  user: {} as User | null,
});

export function ProvideAuth({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState<User | null>(null);

  const signin = async (email: string, password: string): Promise<ResType> => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { user, token, error, status } = (await res.json()) as ResType;

    setUser(user as User);
    return {
      user,
      status,
      token,
      error,
    };
  };

  const signup = async (email: string, password: string) => {
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { user, token, error, status } = (await res.json()) as ResType;

    setUser(user as User);
    return {
      user,
      status,
      token,
      error,
    };
  };

  const signout = async (): Promise<ResType> => {
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { user, token, error, status } = (await res.json()) as ResType;

    setUser(user as User);
    return {
      user,
      status,
      token,
      error,
    };
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/user");

      const { user, error, status } = (await res.json()) as ResType;

      if (user) {
        setUser(user as User);
        return {
          user,
          status,
          error,
        };
      }
    };

    getUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );
    return () => authListener?.unsubscribe();
  }, []);

  return {
    user,
    signin,
    signup,
    signout,
  };
}
