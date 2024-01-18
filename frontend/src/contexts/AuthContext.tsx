"use client";

import {
  useContext,
  useState,
  createContext,
  useEffect,
  Dispatch as ReactDispatch,
  SetStateAction as ReactSetStateAction,
  PropsWithChildren,
} from "react";

export interface IAuthContext {
  isActive: boolean;
  setIsActive: ReactDispatch<ReactSetStateAction<boolean>>;
}

export const AuthContext = createContext<IAuthContext>({
  isActive: false,
  setIsActive: () => {},
});

AuthContext.displayName = "AuthContext";

export const useAuthCtx = (): IAuthContext => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren): React.ReactNode {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const getAuth = async () => {
      const req = await fetch("/api/auth");
      const resp = await req.json();

      if (resp.data.isAuth) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    getAuth();
  }, [isActive]);

  return (
    <AuthContext.Provider value={{ isActive, setIsActive }}>
      {children}
    </AuthContext.Provider>
  );
}
