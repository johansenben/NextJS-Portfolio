"use client";
import { useState } from "react";
import Board from "./Board";
import { BoardCellType, createLockedBoard } from "./util";
import styles from "./sudoku.module.css";

import { NumberBtn, SolveButton } from "./Buttons";
import { clickCell, setCell, user_setCell } from "./actions";

export default function Sudoku() {
  const [isSolving, setIsSolving] = useState(false);
  const [pencilOn, setPencilOn] = useState(true);
  const [board, setBoard] = useState(
    createLockedBoard({ 1: 5, 3: 7, 45: 2, 36: 3, 78: 4, 63: 1 }), //todo createRandomBoard
  );
  const [selected, setSelected] = useState(-1);

  return (
    <>
      <Board
        board={board}
        setCell={(index: number, value: BoardCellType) =>
          setCell(board, setBoard, index, value)
        }
        solveBoard={isSolving}
        selectedCell={selected}
        clickCell={(index?: number) => clickCell(selected, setSelected, index)}
        stopSolving={() => setIsSolving(false)}
      />
      <div className={styles.bottomBtns}>
        <SolveButton setIsSolving={setIsSolving} />

        {Array.from({ length: 9 }, (_, i) => (
          <NumberBtn
            num={i + 1}
            selectedCell={selected}
            user_setCell={(index: number, value: number) =>
              user_setCell(board, setBoard, setSelected, pencilOn, index, value)
            }
            key={`numberBtn-${i}`}
          />
        ))}
      </div>
      <button onClick={() => setPencilOn(!pencilOn)}>pencil</button>
    </>
  );
}
