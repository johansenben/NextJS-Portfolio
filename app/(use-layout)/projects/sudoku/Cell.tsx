"use client";

import clsx from "clsx";
import styles from "./sudoku.module.css";
import { boxWidth, boardWidth, cellContainsNotes } from "./util";
import { BoardCellType } from "./types";

function CellContent({
  value,
  cellIndex,
}: {
  value: BoardCellType;
  cellIndex: number;
}) {
  return value == 0 ? (
    <></>
  ) : cellContainsNotes(value) ? (
    <div className="grid grid-cols-3 grid-rows-3">
      {value.map((val, i) => (
        <span
          className="text-[0.1rem] leading-none aspect-square text-gray-600"
          key={`cell-note-${cellIndex}-${i + 1}`}
        >
          {val && i + 1}
        </span>
      ))}
    </div>
  ) : (
    value
  );
}

export default function Cell({
  value,
  index,
  state,
  clickCell,
  isSelected,
}: {
  value: BoardCellType;
  index: number;
  state: string;
  clickCell: (index?: number) => void;
  isSelected: boolean;
}) {
  return (
    <div
      onClick={() => clickCell(index)}
      className={clsx(
        styles.cell,
        styles[`state-${state}`],
        isSelected ? styles.selected : "",
        { 0: styles.boxBorderOnLeft, [boxWidth - 1]: styles.boxBorderOnRight }[
          index % boxWidth
        ],
        { 0: styles.boxBorderOnTop, [boxWidth - 1]: styles.boxBorderOnBottom }[
          Math.floor(index / boardWidth) % boxWidth
        ],
      )}
    >
      <span className="select-none cursor-pointer">
        <CellContent value={value} cellIndex={index} />
      </span>
    </div>
  );
}
