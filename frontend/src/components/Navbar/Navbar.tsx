"use client";

import { useRouter } from "next/navigation";
import style from "./style.module.css";
import { useAuthCtx } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const ctx = useAuthCtx();

  const handleLogout = async () => {
    const req = await fetch("/api/logout", { method: "DELETE" });

    if (req.status === 302 || req.status === 401) {
      ctx.setIsActive(false);
      router.push("/");
    }

    console.log(ctx.isActive);
  };

  return (
    <nav className={style.nav}>
      <div className={style["nav-links"]}>
        <span className="font-bold mr-10">Tic Tac Toe</span>
      </div>
      {ctx.isActive ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-6 py-4 rounded-lg"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/login"
          className="bg-blue-500 hover:bg-blue-500 px-6 py-4 rounded-lg"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
