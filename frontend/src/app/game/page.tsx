import GameMenu from "@/components/game/GameMenu";

export default function Game(): React.ReactNode {
  return (
    <>
      <div className="flex w-full justify-center">
        <GameMenu />
      </div>
    </>
  );
}
