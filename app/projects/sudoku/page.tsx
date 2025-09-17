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
} from "./util";
import styles from "./sudoku.module.css";

import { NumberBtn, SolveButton } from "./Buttons";

export default function Sudoku() {
  const [isSolving, setIsSolving] = useState(false);
  const [board, setBoard] = useState(
    Array.from(
      { length: boardWidth * boardWidth },
      (_, i) => ({ 1: 5, 3: 7, 45: 2, 36: 3, 78: 4, 63: 1 })[i] ?? 0,
    ),
  );
  const [selected, setSelected] = useState(-1);

  //for when the user clicks on the cell to select it or unselect it
  const clickCell = (index: number = -1) => {
    setSelected(index != selected ? index : -1);
  };

  //sets the cell without any checks
  const setCell = (index: number, value: number) => {
    board[index] = value;
    setBoard([...board]);
  };

  //only for when user tries to set a cell; it checks if the number is correct
  const user_setCell = (index: number, value: number) => {
    let b = [...board];
    const valid = isValid(b, index, value);
    b[index] = getBoardVal(cellStates.LOCKED, value);
    const result = solve(b);
    if (valid && result == solveStates.SOLVED)
      setCell(index, getBoardVal(cellStates.CORRECT_USER_INPUT, value));
    else setCell(index, getBoardVal(cellStates.INCORRECT_USER_INPUT, value));
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
    </>
  );
}
