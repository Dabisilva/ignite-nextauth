import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";
import { api } from "../services/api";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentitals: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (token) {
      api
        .get("me")
        .then((response) => {
          const { permissions, roles, email } = response.data;
          setUser({
            email,
            permissions,
            roles,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    await api
      .post("sessions", { email, password })
      .then((response) => {
        const { permissions, roles, token, refreshToken } = response.data;

        setCookie(undefined, "nextauth.token", token, {
          maxAge: 60 * 60 * 24 * 30, //30 dias
          path: "/",
        });
        setCookie(undefined, "nextauth.refreshToken", refreshToken, {
          maxAge: 60 * 60 * 24 * 30, //30 dias
          path: "/",
        });
        setUser({
          email,
          permissions,
          roles,
        });

        api.defaults.headers["Authorization"] = `Bearer ${token}`;

        Router.push("/dashboard");
      })
      .catch((err) => console.log(err.data));
  }
  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
