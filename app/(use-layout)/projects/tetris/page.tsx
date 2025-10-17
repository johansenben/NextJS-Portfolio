"use client"

import Board from "./Board";
import Controls from "./Controls";
import { useBoard } from "./useBoard";

export default function Tetris() {
  const { board, rotate, moveX, moveDown, newShape } = useBoard();
  return (
    <>
    <Board board={board} />
    <Controls rotate={rotate} newShape={newShape} moveDown={moveDown} moveX={moveX} />
    </>
  );
}