import Cell from "./Cell";
import { CellData } from "./util";

export default function Board({ board }: { board: CellData[] }) {
  return (
    <div className="grid grid-cols-10 w-fit border-4 mx-auto mt-4">
      {board.map((cell, i) => (
        <Cell key={`cell-${i}`} cellType={cell.tile} />
      ))}
    </div>
  );
}
