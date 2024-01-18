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
  username: string;
  setUsername: ReactDispatch<ReactSetStateAction<string>>;
  userId: number;
  setUserId: ReactDispatch<ReactSetStateAction<number>>;
}

export const AuthContext = createContext<IAuthContext>({
  isActive: false,
  setIsActive: () => {},
  username: "",
  setUsername: () => {},
  userId: 0,
  setUserId: () => {},
});

AuthContext.displayName = "AuthContext";

export const useAuthCtx = (): IAuthContext => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren): React.ReactNode {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    const getAuth = async () => {
      const req = await fetch("/api/auth");
      const resp = await req.json();

      if (resp.data.isAuth) {
        setIsActive(true);
        setUsername(resp.data.username);
        setUserId(resp.data.userId);
      } else {
        setIsActive(false);
        setUsername("");
        setUserId(0);
      }
    };

    getAuth();
  }, [isActive]);

  return (
    <AuthContext.Provider
      value={{
        isActive,
        setIsActive,
        username,
        setUsername,
        userId,
        setUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
