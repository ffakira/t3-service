"use client";

import style from "./style.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ScoreStats {
  win: number;
  loose: number;
  tie: number;
}

interface PlayerStats {
  player: string;
  pvp: ScoreStats;
  bot: ScoreStats;
}

const StatsContainer: React.FC<ScoreStats> = ({ win, loose, tie }) => {
  return (
    <>
      <div className="flex gap-x-4 m-2">
        <div className="w-1/3 bg-slate-800 border-l-8 border-green-500 flex flex-col p-2">
          <p className="text-xl text-center">{win}</p>
          <p className="font-bold text-center uppercase">Win</p>
        </div>
        <div className="w-1/3 bg-slate-800 border-l-8 border-red-500 flex flex-col p-2">
          <p className="text-xl text-center">{loose}</p>
          <p className="font-bold text-center uppercase">Loose</p>
        </div>
        <div className="w-1/3 bg-slate-800 border-l-8 border-yellow-500 flex flex-col p-2">
          <p className="text-xl text-center">{tie}</p>
          <p className="font-bold text-center uppercase">Tie</p>
        </div>
      </div>
    </>
  );
};

interface MatchHistoryProps {
  isWin?: boolean;
  player1: string;
  player2: string;
  time: string;
  gameId: string;
}

const MatchHistory: React.FC<MatchHistoryProps> = ({
  isWin,
  player1,
  player2,
  time,
  gameId,
}) => {
  return (
    <>
      <Link href={`/game/history/${gameId}`}>
        <div
          className={`p-2 border-l-8 pl-4 ${
            isWin ? "border-l-green-500" : "border-l-red-500"
          } flex flex-col gap-y-2 gap-x-4 bg-slate-800`}
        >
          <div className="flex gap-x-4">
            <div className="flex gap-x-2 items-center">
              <Image
                src="/images/player_x.png"
                alt="Player X"
                width={20}
                height={20}
              />
              <span>{player1}</span>
            </div>
            <div className="flex gap-x-2">
              <Image
                src="/images/player_o.png"
                alt="Player O"
                width={20}
                height={20}
              />
              <span>{player2}</span>
            </div>
          </div>
          <div className="flex gap-x-2">
            <Image src="/images/clock.svg" alt="clock" width={20} height={20} />
            <span>{time}</span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default function SideNavbar(): React.ReactNode {
  const defaultStats: PlayerStats = {
    player: "johndoe",
    pvp: { win: 0, loose: 0, tie: 0 },
    bot: { win: 0, loose: 0, tie: 0 },
  };
  const [playerStats, setPlayerStats] = useState<PlayerStats>(defaultStats);

  const getPlayerStats = async () => {
    const req = await fetch("http://localhost:3000/api/game/stats/akiraff");
    const resp = await req.json();

    if (req.status === 200) {
      setPlayerStats(resp.data.stats);
    } else {
      setPlayerStats(defaultStats);
    }
  };

  const getMatchHistory = async () => {

  }

  useEffect(() => {
    getPlayerStats();
  }, [playerStats.player]);

  return (
    <>
      <aside>
        <div className={style.aside}>
          <h4 className="text-2xl font-bold mt-4 ml-2">Player Stats</h4>
          <div>
            <div className="flex flex-col bg-slate-800/50 p-2">
              <p className="ml-2 font-bold text-center">PvP Stats</p>
              <StatsContainer {...playerStats.pvp} />
            </div>
            <div className="flex flex-col bg-slate-800/50 p-2 mt-4">
              <p className="ml-2 font-bold text-center">PvC Stats</p>
              <StatsContainer {...playerStats.bot} />
            </div>
          </div>

          <h4 className="text-2xl font-bold mt-4 ml-2">Match History</h4>
          <MatchHistory
            isWin={true}
            player1="photons"
            player2="johndoe"
            time="00:48"
            gameId="abc"
          />
          <MatchHistory
            isWin={false}
            player1="photons"
            player2="johndoe"
            time="01:48"
            gameId="abd"
          />
        </div>
      </aside>
    </>
  );
}
