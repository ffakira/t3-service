"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthCtx } from "@/contexts/AuthContext";
import style from "./style.module.css";

export default function Login(): React.ReactNode {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const ctx = useAuthCtx();
  const router = useRouter();

  const handleLogin = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const req = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
      
      if (req.status === 200) {
        ctx.setIsActive(true);
        router.push("/game");
      }

    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error: ${err.message}`);
      }
    }
  }

  return (
    <>
      <div className="flex flex-col w-full items-center">
        <form method="POST" onSubmit={handleLogin} className={style.container}>
        <h1 className="text-center text-4xl font-bold">Login</h1>
          <div className="flex flex-col">
            <label className="mb-1 font-bold" htmlFor="username">Username</label>
            <input
              className="text-black p-1"
              onChange={(evt) => setUsername(evt.target.value)}
              autoComplete="username"
              type="text"
              name="username"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-bold" htmlFor="password">Password</label>
            <input
              className="text-black p-1"
              onChange={(evt) => setPassword(evt.target.value)}
              autoComplete="current-password"
              type="password"
              name="password"
            />
          </div>

          <button className="mt-4 p-2 bg-blue-500 hover:bg-blue-600" type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
