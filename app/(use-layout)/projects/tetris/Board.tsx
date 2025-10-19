import Cell from "./Cell";
import { CellData } from "./util";

export default function Board({ board, startGameOverlay, startGame }: { board: CellData[], startGameOverlay: boolean, startGame: ()=>void }) {
  return (
    <div className="w-fit relative row-span-3">
      <div className="grid grid-cols-10 w-fit border-4 text-[1rem]">
        {board.map((cell, i) => (
          <Cell key={`cell-${i}`} cellType={cell.tile} />
        ))}
      </div>
      {
        startGameOverlay && <div onClick={startGame} className="flex items-center justify-center w-full h-full bg-[#8886] absolute top-0 font-bold text-xl">Start Game</div>
      }
    </div>
  );
}
