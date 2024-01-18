"use client";

import { useRouter } from "next/navigation";
import { useSocketContext } from "@/contexts/SocketContext";

export default function GameMenu(): React.ReactNode {
  const router = useRouter();
  const { socket } = useSocketContext();

  const handleNewBotMatch = async () => {
    const req = await fetch("/api/game/match/new", {
      method: "POST",
      body: JSON.stringify({
        gameType: "bot",
      }),
    });
    const resp = await req.json();

    if (req.status === 200) {
      router.push("/game/match/" + resp.data.gameId);
    }
  };

  const handleNewPvpMatch = async () => {
    const req = await fetch("/api/game/match/new", {
      method: "POST",
      body: JSON.stringify({
        gameType: "pvp",
      }),
    });
    const resp = await req.json();

    if (req.status === 200) {
      router.push("/game/match/" + resp.data.gameId);
    }
  };

  const handleFindMatch = async () => {
    const req = await fetch("/api/game/match/join", {
      method: "POST",
      body: JSON.stringify({
        gameType: "pvp",
      }),
    });
    const resp = await req.json();

    if (req.status === 200) {
      router.push("/game/match/" + resp.data.gameId);
    }
  };

  return (
    <div className="max-w-[500px] py-8 flex flex-col gap-y-4 items-center bg-teal-950">
      <button
        className="w-[400px] font-bold rounded-lg bg-green-500 hover:bg-green-600 py-[10px]"
        onClick={handleNewPvpMatch}
      >
        Create Match
      </button>
      <button
        className="w-[400px] font-bold rounded-lg bg-blue-500 hover:bg-blue-600 py-[10px]"
        onClick={handleFindMatch}
      >
        Find Match
      </button>
      <button
        className="w-[400px] font-bold rounded-lg bg-blue-500 hover:bg-blue-600 py-[10px]"
        onClick={handleNewBotMatch}
      >
        Play Against Bot
      </button>
    </div>
  );
}
