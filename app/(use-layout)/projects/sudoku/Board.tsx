"use client";
import { useEffect, useState, useRef } from "react";

import Cell from "./Cell";
import styles from "./sudoku.module.css";
import { boardWidth, getCellDisplayValue, getCellStateAsText } from "./util";
import { solve } from "./util";
import { BoardCellType, BoardType } from "./types";

export default function Board({
  board,
  solveBoard,
  setCell,
  selectedCell,
  clickCell,
  stopSolving,
}: {
  board: BoardType;
  solveBoard: boolean;
  setCell: (index: number, value: BoardCellType) => void;
  selectedCell: number;
  clickCell: (index?: number) => void;
  stopSolving: () => void;
}) {
  useEffect(() => {
    if (!solveBoard) return;
    let b = [...board];
    let result = solve(b);

    let updateIndex = 0;
    const interval = setInterval(() => {
      if (updateIndex >= boardWidth * boardWidth) {
        clearInterval(interval);
        stopSolving();
        return;
      }
      setCell(updateIndex, b[updateIndex]);

      updateIndex++;
    }, 100);
    return () => clearInterval(interval);
  }, [solveBoard]);

  return (
    <div className={styles.board}>
      {board.map((value, index) => (
        <Cell
          clickCell={clickCell}
          isSelected={selectedCell == index}
          key={`cell-${index}`}
          value={getCellDisplayValue(value)}
          state={getCellStateAsText(value)}
          index={index}
        />
      ))}
    </div>
  );
}
