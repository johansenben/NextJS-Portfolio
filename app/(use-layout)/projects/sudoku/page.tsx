"use client";
import { useState } from "react";
import Board from "./Board";
import {
  getBoardVal,
  boardWidth,
  solve,
  solveStates,
  cellStates,
  isValid,
  BoardType,
  BoardCellType,
  getCellState,
  cellContainsNotes,
  boxWidth,
} from "./util";
import styles from "./sudoku.module.css";

import { NumberBtn, SolveButton } from "./Buttons";

export default function Sudoku() {
  const [isSolving, setIsSolving] = useState(false);
  const [pencilOn, setPencilOn] = useState(true);
  const [board, setBoard] = useState(
    Array.from(
      { length: boardWidth * boardWidth },
      (_, i) => ({ 1: 5, 3: 7, 45: 2, 36: 3, 78: 4, 63: 1 })[i] ?? 0,
    ) as BoardType
  );
  const [selected, setSelected] = useState(-1);

  //for when the user clicks on the cell to select it or unselect it
  const clickCell = (index: number = -1) => {
    setSelected(index != selected ? index : -1);
  };

  //sets the cell without any checks
  const setCell = (index: number, value: BoardCellType) => {
    board[index] = value;
    setBoard([...board]);
  };

  
  const toggleCellNote = (index: number, value: number) => {
    if (board[index] == 0)
      board[index] = Array(boardWidth).fill(false);
    if (cellContainsNotes(board[index])) {
      board[index][value - 1] = !board[index][value - 1];
      setCell(index, board[index]);
    }
  }

  //removes note in the same row/col/box if the user places the correct number
  const removeNotesAfterCorrectPlacement = (index: number, value: number) => {
    const row = Math.floor(index / boardWidth);
    const col = Math.floor(index % boardWidth);
    for (let i = 0; i < boardWidth; i++) {
      let cell = board[row * boardWidth + i];
      if (cellContainsNotes(cell)) 
        cell[value-1] = false;
      cell = board[i * boardWidth + col];
      if (cellContainsNotes(cell)) 
        cell[value-1] = false;
    }
    for (let i = 0; i < boxWidth; i++) {
      for (let j = 0; j < boxWidth; j++) {
        let cell = board[
          (Math.floor(row / boxWidth) * boxWidth + i) * boardWidth +
          Math.floor(col / boxWidth) * boxWidth +
          j];
        if (cellContainsNotes(cell))
          cell[value-1] = false;
      }
    }
    setBoard([...board]);
  }

  //only for when user tries to set a cell; it checks if the number is correct
  const user_setCell = (index: number, value: number) => {
    let b = [...board];
    const state = getCellState(b[index]);
    if (state == cellStates.LOCKED) {
      setSelected(-1);
      return;
    }
    const valid = isValid(b, index, value);
    if (pencilOn && state == cellStates.EMPTY) {
      if (!valid) return;
      toggleCellNote(index, value);
      return;
    }
    b[index] = getBoardVal(cellStates.LOCKED, value);
    const result = solve(b);
    if (valid && result == solveStates.SOLVED) {
      setCell(index, getBoardVal(cellStates.CORRECT_USER_INPUT, value));
      removeNotesAfterCorrectPlacement(index, value);
    } else setCell(index, getBoardVal(cellStates.INCORRECT_USER_INPUT, value));
    setSelected(-1);
  };

  return (
    <>
      <Board
        board={board}
        setCell={setCell}
        solveBoard={isSolving}
        selectedCell={selected}
        clickCell={clickCell}
        stopSolving={() => setIsSolving(false)}
      />
      <div className={styles.bottomBtns}>
        <SolveButton setIsSolving={setIsSolving} />

        {Array.from({ length: 9 }, (_, i) => (
          <NumberBtn
            num={i + 1}
            selectedCell={selected}
            user_setCell={user_setCell}
            key={`numberBtn-${i}`}
          />
        ))}
      </div>
      <button onClick={() => setPencilOn(!pencilOn)}>pencil</button>
    </>
  );
}
